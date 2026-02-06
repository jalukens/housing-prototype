import { useState } from 'react'
import { useNavigator } from '@/hooks/useNavigator'
import { STEPS, COLORADO_COUNTIES, CREDIT_SCORE_RANGES, OCCUPATIONS, HOUSEHOLD_SIZES } from '@/data/constants'
import { programs } from '@/data/programs'
import { formatCurrency } from '@/lib/utils'

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Icons
import {
  Home, User, MapPin, DollarSign, CreditCard, Briefcase, Shield, ArrowRight, ArrowLeft,
  Sparkles, TrendingUp, Calendar, PiggyBank, Check, ChevronDown, ChevronUp,
  CheckCircle, AlertCircle, MousePointer, Clock, GraduationCap, FileText, Key,
  Users, Building, Send, Search, FileCheck, CheckSquare, ClipboardList
} from 'lucide-react'

export function Navigator() {
  const nav = useNavigator()
  const { step, setStep, formData, updateFormData, eligiblePrograms, packages, affordablePrograms, affordability, creditAssessment, selectPackage, canProceed } = nav

  const [selectedPath, setSelectedPath] = useState(null)
  const [expandedPackages, setExpandedPackages] = useState({})

  const handlePathSelect = (path) => {
    setSelectedPath(path)
    updateFormData({ selectedPath: path })
  }

  const toggleExpand = (key) => {
    setExpandedPackages(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isPackageSelected = (pkg) => {
    return formData.selectedPrograms.length > 0 &&
      pkg.programs.every(p => formData.selectedPrograms.includes(p.id)) &&
      pkg.programs.length === formData.selectedPrograms.length
  }

  // STEP 0: Profile
  const renderProfileStep = () => {
    const canContinue = formData.location && formData.income && formData.creditScore
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to the Navigator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's find the best down payment assistance programs for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Location</CardTitle>
                  <CardDescription>Where do you want to buy?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Select value={formData.location} onValueChange={(v) => updateFormData({ location: v })}>
                <SelectTrigger><SelectValue placeholder="Select a county" /></SelectTrigger>
                <SelectContent>
                  {COLORADO_COUNTIES.map(c => <SelectItem key={c} value={c}>{c} County</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Household Income</CardTitle>
                  <CardDescription>Annual gross income</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Annual Income</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input type="number" placeholder="85,000" className="pl-7" value={formData.income} onChange={(e) => updateFormData({ income: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Household Size</Label>
                <Select value={formData.householdSize} onValueChange={(v) => updateFormData({ householdSize: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {HOUSEHOLD_SIZES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Credit Score</CardTitle>
                  <CardDescription>Approximate range</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={formData.creditScore} onValueChange={(v) => updateFormData({ creditScore: v })}>
                <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                <SelectContent>
                  {CREDIT_SCORE_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {formData.creditScore && creditAssessment && (
                <div className={`p-3 rounded-lg ${creditAssessment.color === 'red' ? 'bg-red-50 text-red-800' : creditAssessment.color === 'amber' ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'}`}>
                  <p className="text-sm font-medium">{creditAssessment.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Savings</CardTitle>
                  <CardDescription>Available for down payment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input type="number" placeholder="10,000" className="pl-7" value={formData.downPaymentSaved} onChange={(e) => updateFormData({ downPaymentSaved: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Additional Details</CardTitle>
                <CardDescription>Help us find more programs</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <Checkbox id="ftb" checked={formData.firstTimeBuyer} onCheckedChange={(c) => updateFormData({ firstTimeBuyer: c })} />
              <div>
                <Label htmlFor="ftb" className="font-medium cursor-pointer">First-time homebuyer</Label>
                <p className="text-sm text-gray-500">Haven't owned a home in the past 3 years</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="vet" checked={formData.veteranStatus} onCheckedChange={(c) => updateFormData({ veteranStatus: c })} />
              <div>
                <Label htmlFor="vet" className="font-medium cursor-pointer">Veteran or active military</Label>
                <p className="text-sm text-gray-500">Eligible for VA home loans</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Special occupation (optional)</Label>
              <Select value={formData.occupation} onValueChange={(v) => updateFormData({ occupation: v })}>
                <SelectTrigger><SelectValue placeholder="Select if applicable" /></SelectTrigger>
                <SelectContent>
                  {OCCUPATIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button variant="gradient" size="xl" onClick={() => setStep(1)} disabled={!canContinue} className="min-w-[200px]">
            See What You Qualify For
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        {!canContinue && <p className="text-center text-sm text-gray-500">Please fill in location, income, and credit score to continue</p>}
      </div>
    )
  }

  // STEP 1: Affordability
  const renderAffordabilityStep = () => {
    const maxAssistance = eligiblePrograms.reduce((max, p) => {
      if (p.calcAmount && !p.isAffordableHousing) return Math.max(max, p.calcAmount(affordability.maxPrice))
      return max
    }, 0)

    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-blue-100 font-medium">Based on your profile</span>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-lg text-blue-100 mb-2">Maximum Home Price</h2>
              <p className="text-5xl md:text-6xl font-bold mb-4">{formatCurrency(affordability.maxPrice)}</p>
              <p className="text-blue-100">With your income of {formatCurrency(parseInt(formData.income || 0))}/year</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Est. Monthly Payment</span>
                <span className="text-2xl font-bold">{formatCurrency(affordability.monthlyPayment)}</span>
              </div>
              <div className="h-px bg-white/20" />
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Your Savings</span>
                <span className="text-xl font-semibold">{formatCurrency(affordability.downPaymentSaved)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Available Assistance</p>
                  <p className="text-3xl font-bold text-green-900">Up to {formatCurrency(maxAssistance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Eligible Programs</p>
                  <p className="text-3xl font-bold text-blue-900">{eligiblePrograms.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-700 font-medium">Est. Timeline</p>
                  <p className="text-3xl font-bold text-purple-900">3-6 mo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <PiggyBank className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 text-lg">You may qualify for significant assistance!</h3>
              <p className="text-amber-800 mt-1">
                Based on your profile, you're eligible for {eligiblePrograms.filter(p => !p.isAffordableHousing).length} down payment assistance programs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="gradient" size="xl" onClick={() => setStep(2)} className="min-w-[250px]">
            See Your Assistance Options
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  // STEP 2: Packages
  const renderPackagesStep = () => {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Assistance Options</h1>
          <p className="text-gray-600">Choose your path to homeownership</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div
            onClick={() => handlePathSelect('dpa')}
            className={`rounded-2xl p-6 cursor-pointer transition-all ${selectedPath === 'dpa' ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-4 ring-blue-300 shadow-xl' : 'bg-gradient-to-br from-blue-500/80 to-indigo-500/80 text-white hover:shadow-lg'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/20">
                  <DollarSign className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Path 1</p>
                  <h3 className="text-2xl font-bold">Down Payment Assistance</h3>
                </div>
              </div>
              {selectedPath === 'dpa' && <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center"><Check className="w-6 h-6 text-blue-600" /></div>}
            </div>
            <p className="text-blue-100 mb-4">Get grants or loans to help cover your down payment.</p>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Up to</span>
                <span className="text-3xl font-bold">{formatCurrency(packages[0]?.totalAssistance || 0)}</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => affordablePrograms.length > 0 && handlePathSelect('affordable')}
            className={`rounded-2xl p-6 transition-all ${affordablePrograms.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : selectedPath === 'affordable' ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white ring-4 ring-purple-300 shadow-xl cursor-pointer' : 'bg-gradient-to-br from-purple-500/80 to-indigo-500/80 text-white hover:shadow-lg cursor-pointer'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/20">
                  <Home className="w-7 h-7" />
                </div>
                <div>
                  <p className={affordablePrograms.length > 0 ? 'text-purple-100 text-sm' : 'text-gray-400 text-sm'}>Path 2</p>
                  <h3 className="text-2xl font-bold">Affordable Housing</h3>
                </div>
              </div>
              {selectedPath === 'affordable' && <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center"><Check className="w-6 h-6 text-purple-600" /></div>}
            </div>
            <p className={affordablePrograms.length > 0 ? 'text-purple-100 mb-4' : 'text-gray-400 mb-4'}>
              {affordablePrograms.length > 0 ? 'Purchase below-market-rate homes.' : 'No affordable housing programs available for your area.'}
            </p>
            {affordablePrograms.length > 0 && (
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Programs</span>
                  <span className="text-3xl font-bold">{affordablePrograms.length}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {!selectedPath && (
          <div className="bg-blue-50 border-2 border-blue-200 border-dashed rounded-2xl p-10 text-center">
            <MousePointer className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Choose Your Path</h3>
            <p className="text-blue-700">Select one of the paths above to see your options</p>
          </div>
        )}

        {selectedPath === 'dpa' && packages.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">DPA Packages</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {packages.map((pkg, idx) => {
                const isBest = idx === 0
                const isSelected = isPackageSelected(pkg)
                return (
                  <Card key={idx} className={`border-2 overflow-hidden ${isSelected ? 'border-green-500 ring-4 ring-green-100' : isBest ? 'border-green-400' : 'border-gray-200'}`}>
                    <div className={`px-6 py-5 ${isBest ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          {(isBest || isSelected) && <Badge className="mb-2 bg-white/20">{isSelected ? '✓ SELECTED' : 'BEST VALUE'}</Badge>}
                          <p className="text-white text-4xl font-bold">{formatCurrency(pkg.totalAssistance)}</p>
                          <p className="text-white/80">total assistance</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/80 text-sm">Est. Monthly</p>
                          <p className="text-white text-2xl font-bold">{formatCurrency(pkg.monthlyPayment)}</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {pkg.programs.map((program, pIdx) => (
                          <div key={pIdx} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">{program.name}</span>
                              <span className="font-bold">{formatCurrency(program.amount)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {program.pros && <div className="flex items-start gap-1"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" /><span className="text-green-700">{program.pros}</span></div>}
                              {program.cons && <div className="flex items-start gap-1"><AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" /><span className="text-amber-700">{program.cons}</span></div>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant={isSelected ? 'default' : 'gradient'} className="w-full mt-4" onClick={() => selectPackage(pkg)}>
                        {isSelected ? '✓ Selected' : 'Select This Package'}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {selectedPath && (
          <div className="flex gap-4 pt-4">
            <Button variant="outline" size="lg" onClick={() => setSelectedPath(null)}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Change Path
            </Button>
            <Button variant="gradient" size="lg" className="flex-1" onClick={() => setStep(3)}>
              Continue to Your Roadmap
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  // STEP 3: Roadmap
  const renderRoadmapStep = () => {
    const totalAssistance = formData.selectedPrograms.reduce((sum, id) => {
      const program = programs.find(p => p.id === id)
      return sum + (program?.calcAmount ? program.calcAmount(affordability.maxPrice) : 0)
    }, 0)

    const phases = [
      { number: 1, title: 'Prepare', subtitle: 'Before house hunting', color: 'red', items: [
        { icon: GraduationCap, title: 'Complete Homebuyer Education' },
        { icon: FileText, title: 'Gather Required Documents' },
        { icon: CreditCard, title: 'Check Your Credit' },
        { icon: Users, title: 'Connect with a Realtor' }
      ]},
      { number: 2, title: 'Search', subtitle: 'While house hunting', color: 'amber', items: [
        { icon: Building, title: 'Get Pre-Approved' },
        { icon: Send, title: 'Submit DPA Applications' },
        { icon: Search, title: 'Start House Hunting' },
        { icon: FileCheck, title: 'Make an Offer' }
      ]},
      { number: 3, title: 'Close', subtitle: 'After offer accepted', color: 'green', items: [
        { icon: CheckSquare, title: 'Verify Program Funding' },
        { icon: ClipboardList, title: 'Final DPA Paperwork' },
        { icon: Home, title: 'Schedule Closing' },
        { icon: Key, title: 'Get Your Keys!' }
      ]}
    ]

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Homebuying Roadmap</h1>
          <p className="text-gray-600">Follow these three phases to purchase your home</p>
        </div>

        {formData.selectedPrograms.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Your Selected Assistance Package</p>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedPrograms.map(id => {
                    const program = programs.find(p => p.id === id)
                    return <Badge key={id} className="bg-white/20 text-white border-0">{program?.name}</Badge>
                  })}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-blue-100 text-xs font-medium mb-1">Total Assistance</p>
                <p className="font-bold text-3xl">{formatCurrency(totalAssistance)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {phases.map(phase => (
            <Card key={phase.number} className={`border-2 ${phase.color === 'red' ? 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50' : phase.color === 'amber' ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50' : 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'}`}>
              <div className={`px-5 py-4 text-white ${phase.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' : phase.color === 'amber' ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">{phase.number}</div>
                  <div>
                    <h3 className="font-bold text-xl">{phase.title}</h3>
                    <p className="text-sm opacity-80">{phase.subtitle}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 space-y-3">
                {phase.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${phase.color === 'red' ? 'bg-red-100 text-red-600' : phase.color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-blue-900 text-lg">Typical Timeline: 3-6 months</p>
            <p className="text-blue-700 mt-1">The homebuying process with DPA typically takes longer than conventional purchases.</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" size="lg" onClick={() => setStep(2)}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Packages
          </Button>
          <Button variant="gradient" size="lg" className="flex-1" onClick={() => setStep(4)}>
            Start Phase 1: Prepare
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  // Placeholder for remaining steps
  const renderComingSoon = (title) => (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600 mb-8">This step is coming soon!</p>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => setStep(step - 1)}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        {step < 8 && (
          <Button variant="gradient" onClick={() => setStep(step + 1)}>
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )

  const renderStep = () => {
    switch (step) {
      case 0: return renderProfileStep()
      case 1: return renderAffordabilityStep()
      case 2: return renderPackagesStep()
      case 3: return renderRoadmapStep()
      case 4: return renderComingSoon('Prepare')
      case 5: return renderComingSoon('Select Realtor')
      case 6: return renderComingSoon('Get Pre-Approved')
      case 7: return renderComingSoon('Apply for DPA')
      case 8: return renderComingSoon('Feedback')
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Colorado Homebuyer Navigator</h1>
                <p className="text-sm text-gray-500">Your path to homeownership</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Step {step + 1}</span>
              <span className="text-gray-400">of</span>
              <span>{STEPS.length}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={(step / (STEPS.length - 1)) * 100} className="h-2" indicatorClassName="bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">{STEPS[step]?.name}</span>
              <span className="text-xs text-gray-500">{Math.round((step / (STEPS.length - 1)) * 100)}% Complete</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderStep()}
      </main>
    </div>
  )
}
