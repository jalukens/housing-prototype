import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Home, DollarSign, Calendar, PiggyBank, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'

export function AffordabilityStep({ formData, affordability, eligiblePrograms, setStep }) {
  const maxAssistance = eligiblePrograms.reduce((max, p) => {
    if (p.calcAmount && !p.isAffordableHousing) {
      const amt = p.calcAmount(affordability.maxPrice)
      return Math.max(max, amt)
    }
    return max
  }, 0)

  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-blue-100 font-medium">Based on your profile</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-lg text-blue-100 mb-2">Maximum Home Price</h2>
            <p className="text-5xl md:text-6xl font-bold mb-4">
              {formatCurrency(affordability.maxPrice)}
            </p>
            <p className="text-blue-100">
              With your income of {formatCurrency(parseInt(formData.income || 0))}/year
            </p>
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
            <div className="flex justify-between items-center">
              <span className="text-blue-100">Down Payment Needed</span>
              <span className="text-xl font-semibold">{formatCurrency(affordability.requiredDown)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Profile Summary */}
      <Card className="border-2">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Profile Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-900">{formData.location} County</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Household</p>
              <p className="font-semibold text-gray-900">{formData.householdSize} person(s)</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Credit Score</p>
              <p className="font-semibold text-gray-900">{formData.creditScore}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">First-time Buyer</p>
              <p className="font-semibold text-gray-900">{formData.firstTimeBuyer ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assistance Teaser */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <PiggyBank className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 text-lg">You may qualify for significant assistance!</h3>
            <p className="text-amber-800 mt-1">
              Based on your profile, you're eligible for {eligiblePrograms.filter(p => !p.isAffordableHousing).length} down payment assistance programs
              {eligiblePrograms.filter(p => p.isAffordableHousing).length > 0 && ` and ${eligiblePrograms.filter(p => p.isAffordableHousing).length} affordable housing programs`}.
            </p>
            <p className="text-amber-700 text-sm mt-2">
              Continue to see your specific assistance package options.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="gradient"
          size="xl"
          onClick={() => setStep(2)}
          className="min-w-[250px]"
        >
          See Your Assistance Options
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
