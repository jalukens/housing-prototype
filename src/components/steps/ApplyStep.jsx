import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { programs } from '@/data/programs'
import { formatCurrency } from '@/lib/utils'
import {
  ArrowRight, ArrowLeft, FileText, Clock, CheckCircle2, AlertCircle,
  Download, ExternalLink, Building, DollarSign, Calendar
} from 'lucide-react'

export function ApplyStep({ formData, affordability, setStep }) {
  const selectedPrograms = formData.selectedPrograms.map(id => programs.find(p => p.id === id)).filter(Boolean)

  const applicationSteps = [
    {
      id: 1,
      title: 'Review Program Requirements',
      description: 'Make sure you understand what each program needs',
      status: 'current'
    },
    {
      id: 2,
      title: 'Complete Applications',
      description: 'Submit required forms for each program',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Await Approval',
      description: 'Programs will review and approve your application',
      status: 'upcoming'
    },
    {
      id: 4,
      title: 'Reserve Funds',
      description: 'Funds are reserved for your home purchase',
      status: 'upcoming'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">Phase 2</Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Your Assistance Programs</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Submit your applications for the programs you've selected. Your lender will help coordinate the timing.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-green-100 text-sm font-medium mb-2">Your Selected Programs</p>
            <div className="flex flex-wrap gap-2">
              {selectedPrograms.map(program => (
                <Badge key={program.id} className="bg-white/20 text-white border-0">
                  {program.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-green-100 text-xs font-medium mb-1">Total Estimated Assistance</p>
            <p className="font-bold text-3xl">
              {formatCurrency(selectedPrograms.reduce((sum, p) => {
                return sum + (p.calcAmount ? p.calcAmount(affordability.maxPrice) : 0)
              }, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between px-4">
        {applicationSteps.map((step, idx) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step.status === 'current'
                ? 'bg-blue-600 text-white'
                : step.status === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-500'
            }`}>
              {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : step.id}
            </div>
            {idx < applicationSteps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full ${
                step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between px-4 text-xs text-gray-500">
        {applicationSteps.map(step => (
          <span key={step.id} className="text-center max-w-[80px]">{step.title}</span>
        ))}
      </div>

      {/* Program Application Cards */}
      <div className="space-y-6">
        {selectedPrograms.map((program) => (
          <Card key={program.id} className="border-2 border-gray-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{program.name}</CardTitle>
                    <CardDescription>{program.provider}</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {formatCurrency(program.calcAmount ? program.calcAmount(affordability.maxPrice) : 0)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="requirements" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-2">
                    <span className="font-medium text-gray-700">Application Requirements</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {/* Requirements List */}
                      <div className="space-y-2">
                        {program.requirements?.map((req, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Checkbox id={`${program.id}-req-${idx}`} />
                            <label
                              htmlFor={`${program.id}-req-${idx}`}
                              className="text-gray-700 text-sm cursor-pointer"
                            >
                              {req}
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Key Details */}
                      <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Processing: {program.processingTime || '2-4 weeks'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Apply: {program.whenToApply || 'With lender application'}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t">
                        {program.applicationUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={program.applicationUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Start Application
                            </a>
                          </Button>
                        )}
                        {program.documentsUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={program.documentsUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" />
                              Download Forms
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 text-lg">Important Timing Notes</h3>
            <ul className="mt-2 space-y-2 text-amber-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Your lender will coordinate timing for most applications</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Some programs have limited funding - apply early!</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Funds are typically reserved once you have an accepted offer</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Keep copies of all submitted documents</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <h3 className="font-bold text-green-900 text-lg mb-4">What Happens Next?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-green-600">1</span>
              </div>
              <p className="font-medium text-gray-900">Find Your Home</p>
              <p className="text-sm text-gray-600 mt-1">Work with your realtor to find the perfect property</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-green-600">2</span>
              </div>
              <p className="font-medium text-gray-900">Make an Offer</p>
              <p className="text-sm text-gray-600 mt-1">Your pre-approval makes you a strong buyer</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-green-600">3</span>
              </div>
              <p className="font-medium text-gray-900">Close & Get Keys</p>
              <p className="text-sm text-gray-600 mt-1">DPA funds applied at closing - you're a homeowner!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(6)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button
          variant="gradient"
          size="lg"
          className="flex-1"
          onClick={() => setStep(8)}
        >
          Complete & Give Feedback
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
