import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { programs } from '@/data/programs'
import {
  ArrowRight, ArrowLeft, Clock, GraduationCap, FileText, CreditCard,
  Users, Building, Send, Search, FileCheck, CheckSquare, ClipboardList, Home, Key
} from 'lucide-react'

export function RoadmapStep({ formData, affordability, setStep }) {
  const totalAssistance = formData.selectedPrograms.reduce((sum, id) => {
    const program = programs.find(p => p.id === id)
    return sum + (program?.calcAmount ? program.calcAmount(affordability.maxPrice) : 0)
  }, 0)

  const phases = [
    {
      number: 1,
      title: 'Prepare',
      subtitle: 'Before house hunting',
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-orange-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100 text-red-600',
      items: [
        { icon: GraduationCap, title: 'Complete Homebuyer Education', desc: '6-8 hours online course' },
        { icon: FileText, title: 'Gather Required Documents', desc: 'Tax returns, pay stubs, bank statements' },
        { icon: CreditCard, title: 'Check Your Credit', desc: 'Free at annualcreditreport.com' },
        { icon: Users, title: 'Connect with a Realtor', desc: 'DPA-experienced agents in your area' }
      ]
    },
    {
      number: 2,
      title: 'Search',
      subtitle: 'While house hunting',
      color: 'amber',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-600',
      items: [
        { icon: Building, title: 'Get Pre-Approved', desc: 'With a DPA-participating lender' },
        { icon: Send, title: 'Submit DPA Applications', desc: 'Some programs need early application' },
        { icon: Search, title: 'Start House Hunting', desc: 'Know your budget from pre-approval' },
        { icon: FileCheck, title: 'Make an Offer', desc: 'Work with your realtor' }
      ]
    },
    {
      number: 3,
      title: 'Close',
      subtitle: 'After offer accepted',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100 text-green-600',
      items: [
        { icon: CheckSquare, title: 'Verify Program Funding', desc: 'Confirm funds still available' },
        { icon: ClipboardList, title: 'Final DPA Paperwork', desc: 'Complete remaining applications' },
        { icon: Home, title: 'Schedule Closing', desc: '45-60 days typical with DPA' },
        { icon: Key, title: 'Get Your Keys!', desc: 'Welcome home!' }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Homebuying Roadmap</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Here's an overview of the journey ahead. Follow these three phases to successfully purchase your home with assistance programs.
        </p>
      </div>

      {/* Selected Package Summary */}
      {formData.selectedPrograms.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Your Selected Assistance Package</p>
              <div className="flex flex-wrap gap-2">
                {formData.selectedPrograms.map(id => {
                  const program = programs.find(p => p.id === id)
                  return (
                    <Badge key={id} variant="secondary" className="bg-white/20 text-white border-0">
                      {program?.name}
                    </Badge>
                  )
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

      {/* Timeline Visual - Desktop */}
      <div className="hidden md:flex items-center justify-between px-8 py-6">
        {phases.map((phase, idx) => (
          <div key={phase.number} className="flex items-center flex-1">
            <div className={`w-16 h-16 bg-gradient-to-br ${phase.gradient} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg z-10`}>
              {phase.number}
            </div>
            {idx < phases.length - 1 && (
              <div className={`flex-1 h-2 mx-2 rounded-full bg-gradient-to-r ${
                idx === 0 ? 'from-red-500 to-amber-500' : 'from-amber-500 to-green-500'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Phase Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {phases.map(phase => (
          <Card
            key={phase.number}
            className={`border-2 ${phase.border} bg-gradient-to-br ${phase.bgGradient} overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className={`bg-gradient-to-r ${phase.gradient} px-5 py-4 text-white`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">
                  {phase.number}
                </div>
                <div>
                  <h3 className="font-bold text-xl">{phase.title}</h3>
                  <p className={`text-${phase.color}-100 text-sm`}>{phase.subtitle}</p>
                </div>
              </div>
            </div>

            <CardContent className="p-5 space-y-3">
              {phase.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${phase.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline Note */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-blue-900 text-lg">Typical Timeline: 3-6 months</p>
          <p className="text-blue-700 mt-1">
            The homebuying process with DPA typically takes longer than conventional purchases due to additional paperwork and approvals. Plan accordingly!
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(2)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Packages
        </Button>
        <Button
          variant="gradient"
          size="lg"
          className="flex-1"
          onClick={() => setStep(4)}
        >
          Start Phase 1: Prepare
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
