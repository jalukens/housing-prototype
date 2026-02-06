import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  ArrowRight, ArrowLeft, GraduationCap, FileText, CreditCard, ExternalLink,
  CheckCircle2, Clock, AlertCircle, BookOpen, Download, Phone
} from 'lucide-react'

export function PrepareStep({ formData, setStep }) {
  const tasks = [
    {
      id: 'education',
      title: 'Complete Homebuyer Education',
      description: 'Required for most DPA programs',
      icon: GraduationCap,
      color: 'blue',
      estimatedTime: '6-8 hours',
      details: [
        'HUD-approved online courses available',
        'Certificate valid for 1-2 years depending on program',
        'Covers budgeting, credit, mortgage process, and home maintenance'
      ],
      resources: [
        { name: 'eHome America', url: 'https://www.ehomeamerica.org/chfa', type: 'Online Course' },
        { name: 'Framework', url: 'https://www.frameworkhomeownership.org', type: 'Online Course' },
        { name: 'CHFA Counselors', url: 'https://www.chfainfo.com', type: 'In-Person' }
      ]
    },
    {
      id: 'documents',
      title: 'Gather Required Documents',
      description: 'Have these ready for lender applications',
      icon: FileText,
      color: 'green',
      estimatedTime: '1-2 days',
      details: [
        'Last 2 years of tax returns (all pages)',
        'Last 30 days of pay stubs',
        'Last 2-3 months of bank statements (all pages)',
        'Government-issued ID',
        'Social Security card'
      ],
      checklist: [
        'Tax returns (2 years)',
        'W-2s or 1099s (2 years)',
        'Pay stubs (30 days)',
        'Bank statements (2-3 months)',
        'Photo ID',
        'Social Security card'
      ]
    },
    {
      id: 'credit',
      title: 'Check and Improve Credit',
      description: 'Review your credit report for errors',
      icon: CreditCard,
      color: 'amber',
      estimatedTime: '30 minutes + ongoing',
      details: [
        'Free credit report at annualcreditreport.com',
        'Dispute any errors you find',
        'Pay down credit card balances',
        'Avoid opening new credit accounts'
      ],
      tips: [
        'Keep credit utilization under 30%',
        'Don\'t close old accounts',
        'Set up autopay to avoid late payments',
        'Wait to make large purchases until after closing'
      ]
    }
  ]

  const getColorClasses = (color) => ({
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200',
      gradient: 'from-blue-50 to-indigo-50'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
      gradient: 'from-green-50 to-emerald-50'
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-200',
      gradient: 'from-amber-50 to-orange-50'
    }
  }[color])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Badge className="mb-4 bg-red-100 text-red-700 border-red-200">Phase 1</Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prepare for Homebuying</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete these essential tasks before you start house hunting. Being prepared will make the process smoother and faster.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium mb-1">Phase 1 Progress</p>
            <p className="text-2xl font-bold">Getting Started</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-100" />
            <span className="text-red-100">Est. 1-2 weeks to complete</span>
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-6">
        {tasks.map((task) => {
          const colors = getColorClasses(task.color)
          return (
            <Card key={task.id} className={`border-2 ${colors.border} overflow-hidden`}>
              <CardHeader className={`bg-gradient-to-r ${colors.gradient}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                      <task.icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{task.title}</CardTitle>
                      <CardDescription className="text-gray-600">{task.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${colors.border} ${colors.text}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {task.estimatedTime}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <span className="font-medium text-gray-700">View Details</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {/* Key Points */}
                        <div className="space-y-2">
                          {task.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                              <span className="text-gray-700 text-sm">{detail}</span>
                            </div>
                          ))}
                        </div>

                        {/* Resources */}
                        {task.resources && (
                          <div className="pt-4 border-t">
                            <p className="font-medium text-gray-900 mb-3">Recommended Resources</p>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {task.resources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                  <div>
                                    <p className="font-medium text-gray-900 text-sm">{resource.name}</p>
                                    <p className="text-xs text-gray-500">{resource.type}</p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Checklist */}
                        {task.checklist && (
                          <div className="pt-4 border-t">
                            <p className="font-medium text-gray-900 mb-3">Document Checklist</p>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {task.checklist.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <Checkbox id={`${task.id}-${idx}`} />
                                  <label
                                    htmlFor={`${task.id}-${idx}`}
                                    className="text-sm text-gray-700 cursor-pointer"
                                  >
                                    {item}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tips */}
                        {task.tips && (
                          <div className="pt-4 border-t">
                            <p className="font-medium text-gray-900 mb-3">Pro Tips</p>
                            <div className="bg-amber-50 rounded-lg p-4 space-y-2">
                              {task.tips.map((tip, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-amber-800 text-sm">{tip}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Help Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900 text-lg">Need Help?</h3>
            <p className="text-indigo-700 mt-1">
              Free HUD-approved housing counselors are available to help you through this process. They can review your finances, help with credit improvement, and guide you through program requirements.
            </p>
            <Button variant="outline" className="mt-3 border-indigo-300 text-indigo-700 hover:bg-indigo-100">
              <ExternalLink className="w-4 h-4 mr-2" />
              Find a Housing Counselor
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(3)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Roadmap
        </Button>
        <Button
          variant="gradient"
          size="lg"
          className="flex-1"
          onClick={() => setStep(5)}
        >
          Continue to Realtor Selection
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
