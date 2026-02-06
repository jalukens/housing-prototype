import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { realtors, getRealtorsByCounty } from '@/data/realtors'
import {
  ArrowRight, ArrowLeft, Search, MapPin, Star, Phone, Mail,
  Award, CheckCircle2, Users, Home, MessageSquare
} from 'lucide-react'

export function RealtorStep({ formData, setStep }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRealtor, setSelectedRealtor] = useState(null)

  const matchingRealtors = getRealtorsByCounty(formData.location)
  const filteredRealtors = matchingRealtors.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Badge className="mb-4 bg-red-100 text-red-700 border-red-200">Phase 1</Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect with a DPA-Experienced Realtor</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Working with a realtor who understands down payment assistance programs can make a huge difference. They'll know how to navigate the unique requirements.
        </p>
      </div>

      {/* Why It Matters */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
        <h3 className="font-bold text-xl mb-4">Why Work with a DPA-Experienced Agent?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Award className="w-8 h-8 text-blue-200 mb-2" />
            <p className="font-medium">Program Knowledge</p>
            <p className="text-sm text-blue-100">They understand DPA timelines and requirements</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Users className="w-8 h-8 text-blue-200 mb-2" />
            <p className="font-medium">Lender Connections</p>
            <p className="text-sm text-blue-100">Strong relationships with participating lenders</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Home className="w-8 h-8 text-blue-200 mb-2" />
            <p className="font-medium">Negotiation Skills</p>
            <p className="text-sm text-blue-100">Can negotiate seller concessions for DPA buyers</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or company..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="self-center px-4 py-2">
          <MapPin className="w-4 h-4 mr-2" />
          {formData.location} County
        </Badge>
      </div>

      {/* Results Count */}
      <p className="text-gray-600">
        Showing <span className="font-semibold">{filteredRealtors.length}</span> DPA-experienced realtors in your area
      </p>

      {/* Realtor Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredRealtors.map((realtor) => (
          <Card
            key={realtor.id}
            className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
              selectedRealtor?.id === realtor.id
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
            onClick={() => setSelectedRealtor(realtor)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {realtor.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{realtor.name}</h3>
                      <p className="text-gray-600 text-sm">{realtor.company}</p>
                    </div>
                    {selectedRealtor?.id === realtor.id && (
                      <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                      <Star className="w-3 h-3 mr-1 fill-amber-500" />
                      {realtor.rating}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                      <Home className="w-3 h-3 mr-1" />
                      {realtor.dpaTransactions}+ DPA transactions
                    </Badge>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {realtor.specialties.slice(0, 3).map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Languages */}
                  {realtor.languages.length > 1 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Speaks: {realtor.languages.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Info - Show when selected */}
              {selectedRealtor?.id === realtor.id && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <a
                    href={`tel:${realtor.phone}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  >
                    <Phone className="w-4 h-4" />
                    {realtor.phone}
                  </a>
                  <a
                    href={`mailto:${realtor.email}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  >
                    <Mail className="w-4 h-4" />
                    {realtor.email}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Realtor Action */}
      {selectedRealtor && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-green-900 text-lg">Ready to connect with {selectedRealtor.name}?</p>
              <p className="text-green-700">They'll help you navigate the homebuying process with DPA expertise.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Questions to Ask Your Realtor</CardTitle>
          <CardDescription>Make sure they're the right fit for your DPA homebuying journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'How many DPA buyers have you helped this year?',
              'Which DPA programs do you have experience with?',
              'Do you have relationships with participating lenders?',
              'How do you handle the longer DPA closing timelines?',
              'Can you help negotiate seller concessions?',
              'What\'s your availability for showings?'
            ].map((question, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{question}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(4)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <Button
          variant="gradient"
          size="lg"
          className="flex-1"
          onClick={() => setStep(6)}
        >
          Continue to Pre-Approval
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
