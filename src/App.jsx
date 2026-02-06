import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Home, User, ArrowRight, ArrowLeft, DollarSign, CreditCard, MapPin, CheckCircle2, Gift, TrendingUp, Building, Star, Phone, Mail, ExternalLink } from 'lucide-react'

// Constants
const COUNTIES = ['Denver', 'Boulder', 'Jefferson', 'Arapahoe', 'Adams', 'El Paso', 'Douglas', 'Larimer', 'Weld', 'Pueblo']
const CREDIT_RANGES = [
  { value: 'below-580', label: 'Below 580' },
  { value: '580-619', label: '580-619' },
  { value: '620-659', label: '620-659' },
  { value: '660-699', label: '660-699' },
  { value: '700-739', label: '700-739' },
  { value: '740-plus', label: '740+' }
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
  const [formData, setFormData] = useState({
    location: '',
    income: '',
    creditScore: '',
    savings: '',
    firstTimeBuyer: true,
    selectedPackage: null,
    selectedRealtor: null,
    selectedLender: null
  })

  const updateFormData = (updates) => setFormData(prev => ({ ...prev, ...updates }))

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
              <p className="text-lg text-gray-600">Let's find the best programs for you.</p>
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
                    <CardTitle>Savings</CardTitle>
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
        const requiredDown = maxPrice * 0.035

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
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-green-700 mb-2">Max Home Price</p>
                  <p className="text-3xl font-bold text-green-800">{formatCurrency(maxPrice)}</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-blue-700 mb-2">Required Down (3.5%)</p>
                  <p className="text-3xl font-bold text-blue-800">{formatCurrency(requiredDown)}</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-purple-700 mb-2">Best DPA Available</p>
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
              { title: 'Assess Your Finances', desc: 'Review income, savings, and credit', done: true },
              { title: 'Explore Programs', desc: 'Find DPA options you qualify for', done: true },
              { title: 'Choose Your Package', desc: 'Select the best assistance program', done: true }
            ]
          },
          {
            phase: PHASES[1], // Prepare (Amber)
            tasks: [
              { title: 'Complete Homebuyer Education', desc: 'Required 8-hour HUD-approved course', done: false },
              { title: 'Gather Documents', desc: 'Pay stubs, tax returns, bank statements', done: false }
            ]
          },
          {
            phase: PHASES[2], // Connect (Purple)
            tasks: [
              { title: 'Choose Your Realtor', desc: 'Work with a DPA-experienced agent', done: false },
              { title: 'Get Pre-Approved', desc: 'Partner with a DPA-approved lender', done: false }
            ]
          },
          {
            phase: PHASES[3], // Apply (Green)
            tasks: [
              { title: 'Find Your Home', desc: 'Shop within your approved budget', done: false },
              { title: 'Submit DPA Application', desc: 'Apply for your assistance package', done: false },
              { title: 'Close on Your Home', desc: 'Sign papers and get your keys!', done: false }
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
                        <div key={taskIdx} className="flex items-center gap-3 p-2">
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 4: // Prepare
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Prepare Your Application</h1>
              <p className="text-lg text-gray-600">Get these items ready before applying</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Homebuyer Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Complete an 8-hour HUD-approved homebuyer education course.</p>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Find a Course
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Last 2 pay stubs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Last 2 years tax returns</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 2 months bank statements</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Photo ID</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
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
              <p className="text-lg text-gray-600">DPA-experienced agents in {formData.location || 'your area'}</p>
            </div>

            <div className="space-y-4">
              {matchingRealtors.map(realtor => (
                <Card
                  key={realtor.id}
                  className={`border-2 cursor-pointer transition-all ${formData.selectedRealtor?.id === realtor.id ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
                  onClick={() => updateFormData({ selectedRealtor: realtor })}
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
                          <span className="text-sm text-gray-500">{realtor.dpaDeals} DPA transactions</span>
                        </div>
                      </div>
                      <Button variant="outline">Contact</Button>
                    </div>
                  </CardContent>
                </Card>
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
              <p className="text-lg text-gray-600">Work with a DPA-experienced lender</p>
            </div>

            <div className="space-y-4">
              {matchingLenders.map(lender => (
                <Card
                  key={lender.id}
                  className={`border-2 cursor-pointer transition-all ${formData.selectedLender?.id === lender.id ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
                  onClick={() => updateFormData({ selectedLender: lender })}
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
                      <Button variant="outline">Contact</Button>
                    </div>
                  </CardContent>
                </Card>
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
              <h1 className="text-3xl font-bold text-gray-900">Apply for DPA</h1>
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

            <Button variant="outline" size="lg" className="w-full" onClick={() => { setStep(0); setFormData({ location: '', income: '', creditScore: '', savings: '', firstTimeBuyer: true, selectedPackage: null, selectedRealtor: null, selectedLender: null }); }}>
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Colorado Homebuyer Navigator</h1>
              <p className="text-sm text-gray-500">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
            </div>
          </div>
          <Progress value={progressValue} className="h-2" />
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
