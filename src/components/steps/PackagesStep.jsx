import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import {
  DollarSign, Home, Check, ChevronDown, ChevronUp,
  CheckCircle, AlertCircle, ArrowRight, ArrowLeft, MousePointer
} from 'lucide-react'

export function PackagesStep({
  formData,
  updateFormData,
  packages,
  affordablePrograms,
  affordability,
  selectPackage,
  expandedPackages,
  setExpandedPackages,
  setStep
}) {
  const [selectedPath, setSelectedPath] = useState(formData.selectedPath)

  const handlePathSelect = (path) => {
    setSelectedPath(path)
    updateFormData({ selectedPath: path })
  }

  const handlePackageSelect = (pkg) => {
    selectPackage(pkg)
  }

  const isPackageSelected = (pkg) => {
    return formData.selectedPrograms.length > 0 &&
      pkg.programs.every(p => formData.selectedPrograms.includes(p.id)) &&
      pkg.programs.length === formData.selectedPrograms.length
  }

  const toggleExpand = (key) => {
    setExpandedPackages(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Assistance Options</h1>
        <p className="text-gray-600">Two paths to homeownership based on your {formData.location} County profile</p>
      </div>

      {/* Path Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* DPA Path */}
        <div
          onClick={() => handlePathSelect('dpa')}
          className={`rounded-2xl p-6 cursor-pointer transition-all ${
            selectedPath === 'dpa'
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-4 ring-blue-300 shadow-xl scale-[1.02]'
              : 'bg-gradient-to-br from-blue-500/80 to-indigo-500/80 text-white hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${selectedPath === 'dpa' ? 'bg-white/30' : 'bg-white/20'}`}>
                <DollarSign className="w-7 h-7" />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Path 1</p>
                <h3 className="text-2xl font-bold">Down Payment Assistance</h3>
              </div>
            </div>
            {selectedPath === 'dpa' && (
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
            )}
          </div>
          <p className="text-blue-100 mb-4">Get grants or loans to help cover your down payment on any eligible home you find.</p>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-100">Up to</span>
              <span className="text-3xl font-bold">{formatCurrency(packages[0]?.totalAssistance || 0)}</span>
            </div>
            <p className="text-blue-200 text-sm mt-1">{packages.length} package options available</p>
          </div>
          {selectedPath !== 'dpa' && (
            <p className="text-center text-white/70 text-sm mt-4 font-medium">Click to select this path</p>
          )}
        </div>

        {/* Affordable Housing Path */}
        <div
          onClick={() => affordablePrograms.length > 0 && handlePathSelect('affordable')}
          className={`rounded-2xl p-6 transition-all ${
            affordablePrograms.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : selectedPath === 'affordable'
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white ring-4 ring-purple-300 shadow-xl scale-[1.02] cursor-pointer'
                : 'bg-gradient-to-br from-purple-500/80 to-indigo-500/80 text-white hover:from-purple-600 hover:to-indigo-600 hover:shadow-lg cursor-pointer'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                affordablePrograms.length === 0 ? 'bg-gray-200' :
                selectedPath === 'affordable' ? 'bg-white/30' : 'bg-white/20'
              }`}>
                <Home className="w-7 h-7" />
              </div>
              <div>
                <p className={affordablePrograms.length > 0 ? 'text-purple-100 text-sm' : 'text-gray-400 text-sm'}>Path 2</p>
                <h3 className="text-2xl font-bold">Affordable Housing</h3>
              </div>
            </div>
            {selectedPath === 'affordable' && (
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-purple-600" />
              </div>
            )}
          </div>
          <p className={`mb-4 ${affordablePrograms.length > 0 ? 'text-purple-100' : 'text-gray-400'}`}>
            {affordablePrograms.length > 0
              ? 'Purchase below-market-rate homes through community land trusts and affordable housing programs.'
              : 'No affordable housing programs available for your area.'}
          </p>
          {affordablePrograms.length > 0 && (
            <>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Programs</span>
                  <span className="text-3xl font-bold">{affordablePrograms.length}</span>
                </div>
                <p className="text-purple-200 text-sm mt-1">Below-market pricing available</p>
              </div>
              {selectedPath !== 'affordable' && (
                <p className="text-center text-white/70 text-sm mt-4 font-medium">Click to select this path</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick Stats - Show when path selected */}
      {selectedPath && (
        <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Est. price:</span>
            <span className="font-bold">{formatCurrency(affordability.maxPrice)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Savings:</span>
            <span className="font-bold">{formatCurrency(affordability.downPaymentSaved)}</span>
          </div>
        </div>
      )}

      {/* Prompt to select if no path chosen */}
      {!selectedPath && (
        <div className="bg-blue-50 border-2 border-blue-200 border-dashed rounded-2xl p-10 text-center">
          <MousePointer className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Choose Your Path</h3>
          <p className="text-blue-700">Select one of the paths above to see your available assistance options</p>
        </div>
      )}

      {/* DPA Packages - Show when DPA path selected */}
      {selectedPath === 'dpa' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Down Payment Assistance Packages</h2>
              <p className="text-gray-600">Grants and loans to help you buy any eligible home</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {packages.map((pkg, idx) => {
              const isBest = idx === 0
              const isSelected = isPackageSelected(pkg)
              const isExpanded = expandedPackages[`pkg-${idx}`]

              return (
                <Card
                  key={idx}
                  className={`border-2 overflow-hidden transition-all ${
                    isSelected ? 'border-green-500 ring-4 ring-green-100 shadow-lg' :
                    isBest ? 'border-green-400 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  {/* Package Header */}
                  <div className={`px-6 py-5 ${isBest ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        {(isBest || isSelected) && (
                          <Badge variant={isSelected ? 'success' : 'secondary'} className="mb-2">
                            {isSelected ? '✓ SELECTED' : 'BEST VALUE'}
                          </Badge>
                        )}
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
                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                      <div className="flex-1 text-center">
                        <p className="text-xs text-gray-500">Out-of-Pocket</p>
                        <p className="font-bold text-gray-900">{formatCurrency(pkg.yourDownPayment)}</p>
                      </div>
                      <div className="w-px h-8 bg-gray-200" />
                      <div className="flex-1 text-center">
                        <p className="text-xs text-gray-500">Programs</p>
                        <p className="font-bold text-gray-900">{pkg.programs.length}</p>
                      </div>
                      <div className="w-px h-8 bg-gray-200" />
                      <div className="flex-1 text-center">
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-bold text-gray-900">{pkg.programs.some(p => p.isGrant) ? 'Grant' : 'Loan'}</p>
                      </div>
                    </div>

                    {/* Programs */}
                    <div className="space-y-4">
                      {pkg.programs.map((program, pIdx) => (
                        <div key={pIdx} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${program.isGrant ? 'bg-green-500' : 'bg-blue-500'}`} />
                              <span className="font-semibold text-gray-900">{program.name}</span>
                              {program.isGrant && (
                                <Badge variant="success" className="text-xs">Grant</Badge>
                              )}
                            </div>
                            <span className="font-bold text-lg">{formatCurrency(program.amount)}</span>
                          </div>

                          {/* Pros & Cons */}
                          <div className="grid grid-cols-2 gap-3">
                            {program.pros && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-green-700">{program.pros}</p>
                              </div>
                            )}
                            {program.cons && (
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-amber-700">{program.cons}</p>
                              </div>
                            )}
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                              {program.description && (
                                <p className="text-sm text-gray-600">{program.description}</p>
                              )}
                              {program.requirements?.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-1">Requirements:</p>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {program.requirements.map((req, rIdx) => (
                                      <li key={rIdx} className="flex items-center gap-1">
                                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Expand Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpand(`pkg-${idx}`)}
                      className="w-full mt-4"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          View Full Details
                        </>
                      )}
                    </Button>

                    {/* Select Button */}
                    <Button
                      variant={isSelected ? 'default' : 'gradient'}
                      className="w-full mt-3"
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      {isSelected ? '✓ Selected' : 'Select This Package'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Affordable Housing - Show when affordable path selected */}
      {selectedPath === 'affordable' && affordablePrograms.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Affordable Housing Programs</h2>
              <p className="text-gray-600">Below-market-rate homes with income restrictions</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {affordablePrograms.map((program, idx) => {
              const isExpanded = expandedPackages[`affordable-${idx}`]

              return (
                <Card key={idx} className="border-2 border-purple-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{program.name}</p>
                        {program.programType && (
                          <Badge variant="secondary" className="mt-1">{program.programType}</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-purple-100 text-xl font-bold mt-3">{program.amount}</p>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4">{program.description}</p>

                    {/* Pros & Cons */}
                    <div className="space-y-3 mb-4">
                      {program.pros && (
                        <div className="flex items-start gap-2 bg-green-50 rounded-lg p-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-green-800 mb-1">Pros</p>
                            <p className="text-sm text-green-700">{program.pros}</p>
                          </div>
                        </div>
                      )}
                      {program.cons && (
                        <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3">
                          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-amber-800 mb-1">Cons</p>
                            <p className="text-sm text-amber-700">{program.cons}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && program.requirements?.length > 0 && (
                      <div className="pt-4 border-t border-gray-200 mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Requirements:</p>
                        <ul className="space-y-1">
                          {program.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpand(`affordable-${idx}`)}
                      className="w-full"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          View Full Details
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Continue Section */}
      {selectedPath && (
        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setSelectedPath(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Change Path
          </Button>
          <Button
            variant="gradient"
            size="lg"
            className="flex-1"
            onClick={() => setStep(3)}
          >
            Continue to Your Roadmap
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
