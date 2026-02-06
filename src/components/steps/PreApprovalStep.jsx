import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { lenders, getLendersByPrograms } from '@/data/lenders'
import { programs } from '@/data/programs'
import {
  ArrowRight, ArrowLeft, Search, Building2, Star, Phone, Globe,
  CheckCircle2, Clock, FileText, Shield, Award, Users
} from 'lucide-react'

export function PreApprovalStep({ formData, setStep }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLender, setSelectedLender] = useState(null)

  // Get lenders that work with selected programs
  const matchingLenders = getLendersByPrograms(formData.selectedPrograms)
  const filteredLenders = matchingLenders.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedProgramNames = formData.selectedPrograms.map(id => {
    const program = programs.find(p => p.id === id)
    return program?.name
  }).filter(Boolean)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">Phase 2</Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Pre-Approved</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Work with a lender who participates in your selected DPA programs. Pre-approval shows sellers you're a serious buyer.
        </p>
      </div>

      {/* Selected Programs Reminder */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl">
        <p className="text-amber-100 text-sm font-medium mb-2">Your Selected Programs</p>
        <div className="flex flex-wrap gap-2">
          {selectedProgramNames.map((name, idx) => (
            <Badge key={idx} className="bg-white/20 text-white border-0">
              {name}
            </Badge>
          ))}
        </div>
        <p className="text-amber-100 text-sm mt-4">
          The lenders below are approved to work with these programs.
        </p>
      </div>

      {/* Why Pre-Approval Matters */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-5">
            <Shield className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Know Your Budget</h3>
            <p className="text-sm text-gray-600 mt-1">
              Get an exact number for how much you can borrow, including DPA funds.
            </p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-5">
            <Award className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Stronger Offers</h3>
            <p className="text-sm text-gray-600 mt-1">
              Sellers take pre-approved buyers more seriously than those without.
            </p>
          </CardContent>
        </Card>
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardContent className="p-5">
            <Clock className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Faster Closing</h3>
            <p className="text-sm text-gray-600 mt-1">
              Much of the paperwork is already done, speeding up the process.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search lenders..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results Count */}
      <p className="text-gray-600">
        Showing <span className="font-semibold">{filteredLenders.length}</span> lenders that work with your selected programs
      </p>

      {/* Lender Cards */}
      <div className="space-y-4">
        {filteredLenders.map((lender) => (
          <Card
            key={lender.id}
            className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
              selectedLender?.id === lender.id
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
            onClick={() => setSelectedLender(lender)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Logo/Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-lg">{lender.name}</h3>
                        {selectedLender?.id === lender.id && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{lender.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                        <Star className="w-3 h-3 mr-1 fill-amber-500" />
                        {lender.rating}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                        <Users className="w-3 h-3 mr-1" />
                        {lender.dpaLoansYTD}+ DPA loans
                      </Badge>
                    </div>
                  </div>

                  {/* Programs */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Participates in:</p>
                    <div className="flex flex-wrap gap-2">
                      {lender.programs.map((programId, idx) => {
                        const program = programs.find(p => p.id === programId)
                        const isSelected = formData.selectedPrograms.includes(programId)
                        return (
                          <Badge
                            key={idx}
                            variant={isSelected ? 'default' : 'secondary'}
                            className={isSelected ? 'bg-blue-600' : ''}
                          >
                            {program?.name || programId}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  {/* Contact - Show when selected */}
                  {selectedLender?.id === lender.id && (
                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-4">
                      <a
                        href={`tel:${lender.phone}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                      >
                        <Phone className="w-4 h-4" />
                        {lender.phone}
                      </a>
                      <a
                        href={lender.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pre-Approval Process */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">What to Expect</CardTitle>
          <CardDescription>The pre-approval process with DPA programs</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="step1">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">1</div>
                  <span>Initial Application</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-11">
                <p className="text-gray-600">
                  Submit your basic information and documents to the lender. They'll run a credit check and verify your income. This typically takes 1-3 days.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="step2">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">2</div>
                  <span>DPA Eligibility Check</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-11">
                <p className="text-gray-600">
                  The lender will verify you meet the requirements for your selected DPA programs. This includes income limits, property requirements, and homebuyer education.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="step3">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">3</div>
                  <span>Pre-Approval Letter</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-11">
                <p className="text-gray-600">
                  Once approved, you'll receive a letter stating how much you can borrow. This letter shows sellers you're a qualified buyer. Pre-approvals are typically valid for 60-90 days.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Documents Reminder */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Have Your Documents Ready</h3>
            <p className="text-gray-600 mt-1">
              You'll need tax returns, pay stubs, bank statements, and ID. If you haven't gathered these yet, head back to the Prepare step.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setStep(4)}
            >
              Back to Prepare Step
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(5)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button
          variant="gradient"
          size="lg"
          className="flex-1"
          onClick={() => setStep(7)}
        >
          Continue to DPA Application
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
