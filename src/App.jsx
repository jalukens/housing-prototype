import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Home, User, ArrowRight, ArrowLeft, DollarSign, CreditCard, MapPin, CheckCircle2, Gift, TrendingUp, Building, Star, Phone, Mail, ExternalLink, Upload, FileText, X, Calendar, Clock, Video, MessageSquare } from 'lucide-react'

// Constants
const COUNTIES = ['Denver', 'Boulder', 'Jefferson', 'Arapahoe', 'Adams', 'El Paso', 'Douglas', 'Larimer', 'Weld', 'Pueblo']
const CREDIT_RANGES = [
  { value: '740-plus', label: '740+' },
  { value: '700-739', label: '700-739' },
  { value: '660-699', label: '660-699' },
  { value: '620-659', label: '620-659' },
  { value: '580-619', label: '580-619' },
  { value: 'below-580', label: 'Below 580' }
]
const STEPS = ['Profile', 'Affordability', 'Programs', 'Roadmap', 'Prepare', 'Realtor', 'Pre-Approval', 'Apply', 'Complete']

// Application phases with colors
const PHASES = [
  { name: 'Learn', color: 'bg-blue-500', lightColor: 'bg-blue-100', textColor: 'text-blue-700', steps: [0, 1, 2], description: 'Discover your options' },
  { name: 'Prepare', color: 'bg-amber-500', lightColor: 'bg-amber-100', textColor: 'text-amber-700', steps: [3, 4], description: 'Get ready to buy' },
  { name: 'Connect', color: 'bg-purple-500', lightColor: 'bg-purple-100', textColor: 'text-purple-700', steps: [5, 6], description: 'Build your team' },
  { name: 'Apply', color: 'bg-green-500', lightColor: 'bg-green-100', textColor: 'text-green-700', steps: [7, 8], description: 'Submit & close' }
]

// Programs data
const PROGRAMS = [
  {
    id: 'metro-dpa',
    name: 'Metro DPA',
    description: 'Down payment assistance for Denver metro area',
    maxAssistance: 25000,
    isGrant: false,
    forgivable: true,
    yearsToForgiveness: 5,
    counties: ['Denver', 'Arapahoe', 'Jefferson', 'Adams', 'Douglas'],
    maxIncome: 150000,
    minCredit: 620,
    firstTimeBuyerOnly: true
  },
  {
    id: 'chfa-dpa',
    name: 'CHFA DPA Grant',
    description: 'Colorado Housing Finance Authority grant',
    maxAssistance: 20000,
    isGrant: true,
    forgivable: true,
    yearsToForgiveness: 0,
    counties: COUNTIES,
    maxIncome: 175000,
    minCredit: 620,
    firstTimeBuyerOnly: false
  },
  {
    id: 'boulder-dpa',
    name: 'Boulder County DPA',
    description: 'Local assistance for Boulder County buyers',
    maxAssistance: 30000,
    isGrant: false,
    forgivable: true,
    yearsToForgiveness: 10,
    counties: ['Boulder'],
    maxIncome: 125000,
    minCredit: 640,
    firstTimeBuyerOnly: true
  }
]

// Lenders data
const LENDERS = [
  { id: 1, name: 'FirstBank Mortgage', rating: 4.8, programs: ['metro-dpa', 'chfa-dpa'], phone: '303-555-0101' },
  { id: 2, name: 'Elevations Credit Union', rating: 4.7, programs: ['chfa-dpa', 'boulder-dpa'], phone: '303-555-0102' },
  { id: 3, name: 'Colorado Lending Source', rating: 4.9, programs: ['metro-dpa', 'chfa-dpa', 'boulder-dpa'], phone: '303-555-0103' }
]

// Realtors data
const REALTORS = [
  { id: 1, name: 'Sarah Johnson', company: 'DPA Experts Realty', rating: 4.9, dpaDeals: 45, counties: ['Denver', 'Arapahoe'] },
  { id: 2, name: 'Mike Chen', company: 'First Home Partners', rating: 4.8, dpaDeals: 38, counties: ['Boulder', 'Jefferson'] },
  { id: 3, name: 'Lisa Rodriguez', company: 'Colorado Dream Homes', rating: 4.7, dpaDeals: 52, counties: COUNTIES }
]

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

function getCreditMin(creditRange) {
  const map = { 'below-580': 500, '580-619': 580, '620-659': 620, '660-699': 660, '700-739': 700, '740-plus': 740 }
  return map[creditRange] || 0
}

function App() {
  const [step, setStep] = useState(0)
  const [showSchedulePopup, setShowSchedulePopup] = useState(false)
  const [showLenderPopup, setShowLenderPopup] = useState(false)
  const [formData, setFormData] = useState({
    location: '',
    income: '',
    creditScore: '',
    savings: '',
    firstTimeBuyer: true,
    selectedPackage: null,
    selectedRealtor: null,
    selectedLender: null,
    documents: {
      payStubs: [],
      taxReturns: [],
      bankStatements: [],
      photoId: [],
      homeEducation: []
    }
  })

  const updateFormData = (updates) => setFormData(prev => ({ ...prev, ...updates }))

  const handleFileUpload = (docType, files) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }))
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: [...prev.documents[docType], ...newFiles]
      }
    }))
  }

  const removeFile = (docType, fileName) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: prev.documents[docType].filter(f => f.name !== fileName)
      }
    }))
  }

  // Calculate eligible programs
  const eligiblePrograms = useMemo(() => {
    if (!formData.location || !formData.income || !formData.creditScore) return []
    const income = parseInt(formData.income) || 0
    const creditMin = getCreditMin(formData.creditScore)

    return PROGRAMS.filter(p => {
      if (!p.counties.includes(formData.location)) return false
      if (income > p.maxIncome) return false
      if (creditMin < p.minCredit) return false
      if (p.firstTimeBuyerOnly && !formData.firstTimeBuyer) return false
      return true
    })
  }, [formData.location, formData.income, formData.creditScore, formData.firstTimeBuyer])

  // Calculate packages
  const packages = useMemo(() => {
    if (eligiblePrograms.length === 0) return []
    const income = parseInt(formData.income) || 0
    const savings = parseInt(formData.savings) || 0
    const maxPrice = Math.min(income * 4.5, 600000)

    return eligiblePrograms.map(program => {
      const assistance = Math.min(program.maxAssistance, maxPrice * 0.05)
      const loanAmount = maxPrice - savings - assistance
      const monthlyPayment = Math.round((loanAmount * 0.065 / 12) + (maxPrice * 0.007 / 12) + 150)

      return {
        program,
        assistance,
        maxPrice,
        monthlyPayment,
        downPaymentNeeded: Math.max(0, maxPrice * 0.035 - assistance - savings)
      }
    }).sort((a, b) => b.assistance - a.assistance)
  }, [eligiblePrograms, formData.income, formData.savings])

  // Matching lenders and realtors
  const matchingLenders = formData.selectedPackage
    ? LENDERS.filter(l => l.programs.includes(formData.selectedPackage.program.id))
    : LENDERS

  const matchingRealtors = formData.location
    ? REALTORS.filter(r => r.counties.includes(formData.location))
    : REALTORS

  const canContinue = step === 0 ? (formData.location && formData.income && formData.creditScore) : true
  const progressValue = ((step + 1) / STEPS.length) * 100

  const renderStep = () => {
    switch (step) {
      case 0: // Profile
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to the Navigator</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find down payment assistance programs you qualify for, see how much you can afford,
                and get connected with Down Payment Assistance-experienced professionals to guide you home.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle>Location</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Select value={formData.location} onValueChange={(v) => updateFormData({ location: v })}>
                    <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                    <SelectContent>
                      {COUNTIES.map(c => <SelectItem key={c} value={c}>{c} County</SelectItem>)}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle>Annual Income</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input type="number" placeholder="85000" className="pl-7" value={formData.income} onChange={(e) => updateFormData({ income: e.target.value })} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                    </div>
                    <CardTitle>Credit Score</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Select value={formData.creditScore} onValueChange={(v) => updateFormData({ creditScore: v })}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {CREDIT_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle>Down Payment Saved</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input type="number" placeholder="10000" className="pl-7" value={formData.savings} onChange={(e) => updateFormData({ savings: e.target.value })} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="firstTime"
                    checked={formData.firstTimeBuyer}
                    onCheckedChange={(c) => updateFormData({ firstTimeBuyer: c })}
                  />
                  <div>
                    <Label htmlFor="firstTime" className="font-medium cursor-pointer">First-time homebuyer</Label>
                    <p className="text-sm text-gray-500">Haven't owned a home in the past 3 years</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 1: // Affordability
        const maxPrice = Math.min((parseInt(formData.income) || 0) * 4.5, 600000)
        const minPrice = Math.round(maxPrice * 0.65)
        const requiredDown = maxPrice * 0.035
        const calcMonthly = (price) => {
          const loan = price * 0.965
          const monthly = (loan * 0.065 / 12) + (price * 0.007 / 12) + 150
          return Math.round(monthly)
        }

        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Your Buying Power</h1>
              <p className="text-lg text-gray-600">Based on your income and savings</p>
            </div>

            {/* Color-coded Application Phases */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Your Homebuying Journey</CardTitle>
                <CardDescription>Four phases to homeownership</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {PHASES.map((phase, idx) => {
                    const isActive = phase.steps.includes(step)
                    const isComplete = phase.steps[phase.steps.length - 1] < step
                    return (
                      <div key={phase.name} className="text-center">
                        <div className={`h-2 rounded-full mb-2 ${isComplete ? phase.color : isActive ? phase.color : 'bg-gray-200'}`} />
                        <div className={`p-3 rounded-lg ${isActive ? phase.lightColor : 'bg-gray-50'}`}>
                          <p className={`font-semibold text-sm ${isActive ? phase.textColor : 'text-gray-500'}`}>{phase.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{phase.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">You're in the Learn phase:</span> Discovering your buying power and available assistance programs.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-200 bg-green-50 col-span-full">
                <CardContent className="pt-6">
                  <p className="text-sm text-green-700 mb-3 text-center font-medium">What You Can Afford</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-800">{formatCurrency(minPrice)}</p>
                      <p className="text-xs text-green-600">{formatCurrency(calcMonthly(minPrice))}/mo</p>
                    </div>
                    <div className="text-green-400 font-bold text-xl">→</div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-800">{formatCurrency(maxPrice)}</p>
                      <p className="text-xs text-green-600">{formatCurrency(calcMonthly(maxPrice))}/mo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-blue-700 mb-2">Required Down (3.5%)</p>
                  <p className="text-3xl font-bold text-blue-800">{formatCurrency(requiredDown)}</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-purple-700 mb-2">Best Down Payment Assistance</p>
                  <p className="text-3xl font-bold text-purple-800">{formatCurrency(packages[0]?.assistance || 0)}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Eligible Programs Found: {eligiblePrograms.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {eligiblePrograms.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{p.name}</span>
                      <Badge variant={p.isGrant ? "default" : "secondary"}>
                        {p.isGrant ? 'Grant' : 'Forgivable'} up to {formatCurrency(p.maxAssistance)}
                      </Badge>
                    </div>
                  ))}
                  {eligiblePrograms.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No programs match your criteria. Try adjusting your profile.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2: // Programs/Packages
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Choose Your Package</h1>
              <p className="text-lg text-gray-600">Select the best assistance option for you</p>
            </div>

            <div className="space-y-4">
              {packages.map((pkg, idx) => (
                <Card
                  key={pkg.program.id}
                  className={`border-2 cursor-pointer transition-all ${formData.selectedPackage?.program.id === pkg.program.id ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
                  onClick={() => updateFormData({ selectedPackage: pkg })}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {idx === 0 && <Badge className="bg-yellow-500">Best Value</Badge>}
                          <h3 className="text-xl font-bold">{pkg.program.name}</h3>
                        </div>
                        <p className="text-gray-600">{pkg.program.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-green-600 font-medium">
                            {pkg.program.isGrant ? '✓ Grant (free money!)' : `✓ Forgiven after ${pkg.program.yearsToForgiveness} years`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">{formatCurrency(pkg.assistance)}</p>
                        <p className="text-sm text-gray-500">assistance</p>
                        <p className="text-lg font-semibold mt-2">{formatCurrency(pkg.monthlyPayment)}/mo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {packages.length === 0 && (
                <Card className="border-2">
                  <CardContent className="pt-6 text-center text-gray-500">
                    No packages available. Please go back and adjust your profile.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )

      case 3: // Roadmap
        const roadmapPhases = [
          {
            phase: PHASES[0], // Learn (Blue)
            tasks: [
              { title: 'Assess Your Finances', desc: 'Review income, savings, and credit', done: true, goToStep: 0 },
              { title: 'Explore Programs', desc: 'Find Down Payment Assistance options you qualify for', done: true, goToStep: 1 },
              { title: 'Choose Your Package', desc: 'Select the best assistance program', done: true, goToStep: 2 }
            ]
          },
          {
            phase: PHASES[1], // Prepare (Amber)
            tasks: [
              { title: 'Complete Homebuyer Education', desc: 'Required 8-hour HUD-approved course', done: false, goToStep: 4 },
              { title: 'Gather Documents', desc: 'Pay stubs, tax returns, bank statements', done: false, goToStep: 4 }
            ]
          },
          {
            phase: PHASES[2], // Connect (Purple)
            tasks: [
              { title: 'Choose Your Realtor', desc: 'Work with a Down Payment Assistance-experienced agent', done: false, goToStep: 5 },
              { title: 'Get Pre-Approved', desc: 'Partner with a Down Payment Assistance-approved lender', done: false, goToStep: 6 }
            ]
          },
          {
            phase: PHASES[3], // Apply (Green)
            tasks: [
              { title: 'Find Your Home', desc: 'Shop within your approved budget', done: false, goToStep: null },
              { title: 'Submit Application', desc: 'Apply for your assistance package', done: false, goToStep: 7 },
              { title: 'Close on Your Home', desc: 'Sign papers and get your keys!', done: false, goToStep: 8 }
            ]
          }
        ]

        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Your Homebuying Roadmap</h1>
              <p className="text-lg text-gray-600">Follow these color-coded phases to homeownership</p>
            </div>

            {/* Phase Progress Bar */}
            <div className="flex gap-1">
              {PHASES.map((phase, idx) => (
                <div key={phase.name} className="flex-1">
                  <div className={`h-3 rounded-full ${idx === 0 ? phase.color : 'bg-gray-200'}`} />
                  <p className={`text-xs text-center mt-1 font-medium ${idx === 0 ? phase.textColor : 'text-gray-400'}`}>{phase.name}</p>
                </div>
              ))}
            </div>

            {/* Phase Cards */}
            <div className="space-y-6">
              {roadmapPhases.map((section, sectionIdx) => (
                <Card key={section.phase.name} className={`border-2 ${sectionIdx === 0 ? 'border-blue-300' : ''}`}>
                  <CardHeader className={section.phase.lightColor}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${section.phase.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {sectionIdx + 1}
                      </div>
                      <div>
                        <CardTitle className={section.phase.textColor}>{section.phase.name} Phase</CardTitle>
                        <CardDescription>{section.phase.description}</CardDescription>
                      </div>
                      {sectionIdx === 0 && <Badge className="ml-auto bg-blue-500">Current</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {section.tasks.map((task, taskIdx) => (
                        <div
                          key={taskIdx}
                          className={`flex items-center justify-between gap-3 p-2 rounded-lg transition-colors ${task.goToStep !== null ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                          onClick={() => task.goToStep !== null && setStep(task.goToStep)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.done ? 'bg-green-100' : 'bg-gray-100'}`}>
                              {task.done ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <div className={`w-2 h-2 rounded-full ${section.phase.color}`} />
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${task.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</p>
                              <p className="text-sm text-gray-500">{task.desc}</p>
                            </div>
                          </div>
                          {task.goToStep !== null && (
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 4: // Prepare
        const documentTypes = [
          { key: 'payStubs', label: 'Pay Stubs', description: 'Last 2 pay stubs', required: 2 },
          { key: 'taxReturns', label: 'Tax Returns', description: 'Last 2 years tax returns', required: 2 },
          { key: 'bankStatements', label: 'Bank Statements', description: '2 months bank statements', required: 2 },
          { key: 'photoId', label: 'Photo ID', description: 'Government-issued ID', required: 1 },
          { key: 'homeEducation', label: 'Homebuyer Education Certificate', description: 'Certificate of completion', required: 1 }
        ]

        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Document Center</h1>
              <p className="text-lg text-gray-600">Upload your documents to keep everything in one place</p>
            </div>

            {/* Homebuyer Education Card */}
            <Card className="border-2 border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-6 h-6 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900">Homebuyer Education Course</h3>
                    <p className="text-sm text-amber-700 mt-1">Complete an 8-hour HUD-approved course. Required for most Down Payment Assistance programs.</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Find a Course
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Upload Cards */}
            <div className="space-y-4">
              {documentTypes.map(docType => {
                const uploadedFiles = formData.documents[docType.key] || []
                const isComplete = uploadedFiles.length >= docType.required

                return (
                  <Card key={docType.key} className={`border-2 ${isComplete ? 'border-green-200 bg-green-50/50' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isComplete ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {isComplete ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{docType.label}</h3>
                            <p className="text-sm text-gray-500">{docType.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {uploadedFiles.length} of {docType.required} uploaded
                            </p>
                          </div>
                        </div>

                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => handleFileUpload(docType.key, e.target.files)}
                          />
                          <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm font-medium">Upload</span>
                          </div>
                        </label>
                      </div>

                      {/* Uploaded Files List */}
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                                <span className="text-xs text-gray-400">
                                  ({(file.size / 1024).toFixed(0)} KB)
                                </span>
                              </div>
                              <button
                                onClick={() => removeFile(docType.key, file.name)}
                                className="p-1 hover:bg-red-100 rounded transition-colors"
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Progress Summary */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Document Progress</h3>
                    <p className="text-sm text-gray-500">
                      {documentTypes.filter(d => (formData.documents[d.key]?.length || 0) >= d.required).length} of {documentTypes.length} categories complete
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {documentTypes.map(d => (
                      <div
                        key={d.key}
                        className={`w-3 h-3 rounded-full ${(formData.documents[d.key]?.length || 0) >= d.required ? 'bg-green-500' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 5: // Realtor
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Building className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Choose Your Realtor</h1>
              <p className="text-lg text-gray-600">Down Payment Assistance-experienced agents in {formData.location || 'your area'}</p>
            </div>

            <div className="space-y-4">
              {matchingRealtors.map(realtor => (
                <div key={realtor.id} className="relative">
                  <Card
                    className={`border-2 cursor-pointer transition-all ${formData.selectedRealtor?.id === realtor.id ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
                    onClick={() => {
                      updateFormData({ selectedRealtor: realtor })
                      setShowSchedulePopup(true)
                    }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{realtor.name}</h3>
                          <p className="text-gray-600">{realtor.company}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-amber-500">
                              <Star className="w-4 h-4 fill-current" /> {realtor.rating}
                            </span>
                            <span className="text-sm text-gray-500">{realtor.dpaDeals} Down Payment Assistance transactions</span>
                          </div>
                        </div>
                        <Button variant="outline">Select</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Schedule Meeting Popup */}
                  {showSchedulePopup && formData.selectedRealtor?.id === realtor.id && (
                    <Card className="absolute top-full left-0 right-0 mt-2 z-10 border-2 border-blue-300 shadow-xl">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Schedule a Meeting with {realtor.name}</CardTitle>
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowSchedulePopup(false); }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600">Choose how you'd like to connect:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-auto py-3"
                            onClick={(e) => { e.stopPropagation(); setShowSchedulePopup(false); }}
                          >
                            <Video className="w-4 h-4 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Video Call</p>
                              <p className="text-xs text-gray-500">30 min intro</p>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-auto py-3"
                            onClick={(e) => { e.stopPropagation(); setShowSchedulePopup(false); }}
                          >
                            <Phone className="w-4 h-4 text-green-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Phone Call</p>
                              <p className="text-xs text-gray-500">Quick chat</p>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-auto py-3"
                            onClick={(e) => { e.stopPropagation(); setShowSchedulePopup(false); }}
                          >
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">In-Person</p>
                              <p className="text-xs text-gray-500">Meet at office</p>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-auto py-3"
                            onClick={(e) => { e.stopPropagation(); setShowSchedulePopup(false); }}
                          >
                            <MessageSquare className="w-4 h-4 text-amber-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Send Message</p>
                              <p className="text-xs text-gray-500">Email intro</p>
                            </div>
                          </Button>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500 text-center">Select an option to continue</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 6: // Pre-Approval
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Get Pre-Approved</h1>
              <p className="text-lg text-gray-600">Work with a Down Payment Assistance-experienced lender</p>
            </div>

            <div className="space-y-4">
              {matchingLenders.map(lender => (
                <div key={lender.id} className="relative">
                  <Card
                    className={`border-2 cursor-pointer transition-all ${formData.selectedLender?.id === lender.id ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
                    onClick={() => {
                      updateFormData({ selectedLender: lender })
                      setShowLenderPopup(true)
                    }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{lender.name}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-amber-500">
                              <Star className="w-4 h-4 fill-current" /> {lender.rating}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <Phone className="w-4 h-4" /> {lender.phone}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline">Select</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Schedule Meeting Popup */}
                  {showLenderPopup && formData.selectedLender?.id === lender.id && (
                    <Card className="absolute top-full left-0 right-0 mt-2 z-10 border-2 border-blue-300 shadow-xl">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Connect with {lender.name}</CardTitle>
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowLenderPopup(false); }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600">Choose how you'd like to connect:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-auto py-3"
                            onClick={(e) => { e.stopPropagation(); setShowLenderPopup(false); }}
                          >
                            <Video className="w-4 h-4 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Video Call</p>
                              <p className="text-xs text-gray-500">30 min consult</p>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-auto py-3"
                            onClick={(e) => { e.stopPropagation(); setShowLenderPopup(false); }}
                          >
                            <Phone className="w-4 h-4 text-green-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Phone Call</p>
                              <p className="text-xs text-gray-500">Quick chat</p>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-auto py-3"
                            onClick={(e) => { e.stopPropagation(); setShowLenderPopup(false); }}
                          >
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">In-Person</p>
                              <p className="text-xs text-gray-500">Branch visit</p>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 h-auto py-3"
                            onClick={(e) => { e.stopPropagation(); setShowLenderPopup(false); }}
                          >
                            <MessageSquare className="w-4 h-4 text-amber-600" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Send Message</p>
                              <p className="text-xs text-gray-500">Email inquiry</p>
                            </div>
                          </Button>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500 text-center">Select an option to start pre-approval</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 7: // Apply
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Apply for Down Payment Assistance</h1>
              <p className="text-lg text-gray-600">You're ready to apply!</p>
            </div>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">Your Selected Package</h3>
                {formData.selectedPackage ? (
                  <div className="space-y-2">
                    <p><strong>Program:</strong> {formData.selectedPackage.program.name}</p>
                    <p><strong>Assistance:</strong> {formatCurrency(formData.selectedPackage.assistance)}</p>
                    <p><strong>Est. Monthly Payment:</strong> {formatCurrency(formData.selectedPackage.monthlyPayment)}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No package selected. Go back to choose one.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-xl font-bold">Your Team</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Realtor</p>
                    <p className="font-semibold">{formData.selectedRealtor?.name || 'Not selected'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Lender</p>
                    <p className="font-semibold">{formData.selectedLender?.name || 'Not selected'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="gradient" size="lg" className="w-full">
              <ExternalLink className="w-5 h-5 mr-2" />
              Start Application
            </Button>
          </div>
        )

      case 8: // Complete
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Congratulations!</h1>
              <p className="text-lg text-gray-600">You've completed the homebuyer navigator</p>
            </div>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6 text-center">
                <p className="text-green-800">Your journey to homeownership is underway. Your realtor and lender will guide you through the rest of the process.</p>
              </CardContent>
            </Card>

            <Button variant="outline" size="lg" className="w-full" onClick={() => { setStep(0); setFormData({ location: '', income: '', creditScore: '', savings: '', firstTimeBuyer: true, selectedPackage: null, selectedRealtor: null, selectedLender: null, documents: { payStubs: [], taxReturns: [], bankStatements: [], photoId: [], homeEducation: [] } }); }}>
              Start Over
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Colorado Homebuyer Navigator</h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {STEPS.map((stepName, idx) => {
              const phase = PHASES.find(p => p.steps.includes(idx))
              const isComplete = idx < step
              const isCurrent = idx === step
              return (
                <div key={stepName} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full h-2 rounded-full transition-all ${
                      isComplete ? phase?.color || 'bg-blue-500' :
                      isCurrent ? phase?.color || 'bg-blue-500' :
                      'bg-gray-200'
                    }`}
                  />
                  <span className={`text-[10px] mt-1 truncate max-w-full ${
                    isCurrent ? 'font-semibold text-gray-900' :
                    isComplete ? 'text-gray-600' :
                    'text-gray-400'
                  }`}>
                    {stepName}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {renderStep()}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          {step < STEPS.length - 1 && (
            <Button
              variant="gradient"
              onClick={() => setStep(step + 1)}
              disabled={!canContinue}
            >
              {step === 0 ? 'See What You Qualify For' : 'Continue'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
