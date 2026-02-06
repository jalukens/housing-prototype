import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { programs } from '@/data/programs'
import { formatCurrency } from '@/lib/utils'
import {
  PartyPopper, Heart, Star, MessageSquare, Download, Share2,
  CheckCircle2, Home, DollarSign, Calendar, FileText, Send
} from 'lucide-react'

export function FeedbackStep({ formData, affordability }) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState({
    helpful: false,
    easy: false,
    informative: false,
    recommend: false
  })
  const [submitted, setSubmitted] = useState(false)

  const selectedPrograms = formData.selectedPrograms.map(id => programs.find(p => p.id === id)).filter(Boolean)
  const totalAssistance = selectedPrograms.reduce((sum, p) => {
    return sum + (p.calcAmount ? p.calcAmount(affordability.maxPrice) : 0)
  }, 0)

  const handleSubmitFeedback = () => {
    setSubmitted(true)
  }

  return (
    <div className="space-y-8">
      {/* Celebration Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <PartyPopper className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          You've completed the Colorado Homebuyer Navigator. You now have a personalized roadmap to homeownership with down payment assistance.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <h2 className="text-xl font-bold mb-6">Your Homebuying Summary</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Home className="w-6 h-6 text-blue-200" />
                <div>
                  <p className="text-blue-100 text-sm">Maximum Home Price</p>
                  <p className="text-2xl font-bold">{formatCurrency(affordability.maxPrice)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-200" />
                <div>
                  <p className="text-blue-100 text-sm">Total Assistance</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalAssistance)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-purple-200" />
                <div>
                  <p className="text-blue-100 text-sm">Est. Monthly Payment</p>
                  <p className="text-2xl font-bold">{formatCurrency(affordability.monthlyPayment)}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-blue-100 text-sm mb-3">Selected Programs</p>
            <div className="space-y-2">
              {selectedPrograms.map(program => (
                <div key={program.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                  <span className="font-medium">{program.name}</span>
                  <Badge className="bg-white/20 text-white border-0">
                    {formatCurrency(program.calcAmount ? program.calcAmount(affordability.maxPrice) : 0)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Download className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Download Summary</h3>
            <p className="text-sm text-gray-600 mt-1">Save your personalized plan as a PDF</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Print Checklist</h3>
            <p className="text-sm text-gray-600 mt-1">Get a printable checklist of next steps</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Share2 className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Share Navigator</h3>
            <p className="text-sm text-gray-600 mt-1">Help others find assistance too</p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Section */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Help Us Improve</CardTitle>
              <CardDescription>Your feedback helps us serve future homebuyers better</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!submitted ? (
            <>
              {/* Star Rating */}
              <div>
                <Label className="mb-2 block">How would you rate your experience?</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <Label>What did you find valuable? (Select all that apply)</Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { id: 'helpful', label: 'Clear guidance on next steps' },
                    { id: 'easy', label: 'Easy to understand' },
                    { id: 'informative', label: 'Good program information' },
                    { id: 'recommend', label: 'Would recommend to others' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        id={item.id}
                        checked={feedback[item.id]}
                        onCheckedChange={(checked) => setFeedback({ ...feedback, [item.id]: checked })}
                      />
                      <label htmlFor={item.id} className="text-sm text-gray-700 cursor-pointer">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmitFeedback}
                className="bg-amber-500 hover:bg-amber-600"
                disabled={rating === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Thank You!</h3>
              <p className="text-gray-600 mt-1">Your feedback helps us improve the Navigator for future homebuyers.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps Reminder */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
        <h3 className="font-bold text-green-900 text-lg mb-4">Your Immediate Next Steps</h3>
        <div className="space-y-3">
          {[
            'Complete homebuyer education course (if not already done)',
            'Gather all required documents',
            'Contact a DPA-experienced lender for pre-approval',
            'Connect with a realtor who knows DPA programs',
            'Start house hunting within your budget!'
          ].map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
              </div>
              <span className="text-green-800">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Start Over */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Start Over with New Profile
        </Button>
      </div>
    </div>
  )
}
