import React, { useState } from 'react';
import { Home, FileText, Users, DollarSign, GraduationCap, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';

const DocumentsDropdown = ({ documents, isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900">Documents to Gather</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
            {documents.length} items
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-4">
            Start gathering these documents now to speed up your applications later.
          </p>
          <div className="space-y-2">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-gray-300"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.programs}</p>
                  {doc.optional && (
                    <p className="text-xs text-blue-600 mt-1">💡 {doc.optional}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ColoradoHomebuyerNavigator = () => {
  const [step, setStep] = useState(0);
  const [showDocuments, setShowDocuments] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    income: '',
    householdSize: '1',
    firstTimeBuyer: true,
    downPaymentSaved: '',
    creditScore: '',
    selectedPrograms: [],
    employerName: '',
    veteranStatus: false
  });
  const [feedback, setFeedback] = useState({
    helpful: null,
    clarity: '',
    wouldPay: null,
    comments: ''
  });

  // Program eligibility logic
  const programs = [
    {
      id: 'chfa-grant',
      name: 'CHFA Down Payment Grant',
      amount: 'Up to $25,000 (3% of loan)',
      description: 'Grant (no repayment) paired with CHFA first mortgage',
      requirements: ['First-time buyer', 'CHFA mortgage', 'Income limits apply'],
      counties: ['all'],
      incomeLimit: 140000,
      pros: 'No repayment required',
      cons: 'Higher interest rate on mortgage'
    },
    {
      id: 'chfa-second',
      name: 'CHFA Second Mortgage',
      amount: 'Up to $25,000 (4% of loan)',
      description: 'Silent second mortgage, deferred payment',
      requirements: ['First-time buyer', 'CHFA mortgage'],
      counties: ['all'],
      incomeLimit: 140000,
      pros: 'Lower interest rate than grant option',
      cons: 'Reduces equity when you sell'
    },
    {
      id: 'metro-dpa',
      name: 'MetroDPA (Denver Metro)',
      amount: 'Up to 5% of purchase price',
      description: 'Forgivable loan - forgiven after 3 years',
      requirements: ['Denver/Jefferson/Adams/Arapahoe/Douglas/Broomfield county', 'First-time buyer'],
      counties: ['Denver', 'Jefferson', 'Adams', 'Arapahoe', 'Douglas', 'Broomfield'],
      incomeLimit: 176700,
      pros: 'Completely forgiven after 3 years',
      cons: 'Cannot stack with CHFA grant'
    },
    {
      id: 'idf-boulder',
      name: 'IDF Boulder County DPA',
      amount: 'Up to 20% of purchase price',
      description: 'Down payment assistance for Boulder County residents',
      requirements: ['Boulder County', 'Income limits', 'Homebuyer education'],
      counties: ['Boulder'],
      incomeLimit: 120000,
      pros: 'Can be substantial amount',
      cons: 'Long processing time (4-6 weeks)'
    },
    {
      id: 'boulder-h2o',
      name: 'Boulder H2O Loan',
      amount: 'Up to 15% down payment',
      description: 'Revolving loan fund for Boulder residents',
      requirements: ['City of Boulder', 'Complete education BEFORE offer', 'Permanently affordable housing'],
      counties: ['Boulder'],
      incomeLimit: 95000,
      pros: 'Low interest rate',
      cons: 'Must complete education before making offer'
    },
    {
      id: 'chac-loan',
      name: 'CHAC Down Payment Loan',
      amount: 'Up to $12,000',
      description: 'Second mortgage with flexible terms',
      requirements: ['Statewide', 'Homebuyer education', 'CHAC counseling'],
      counties: ['all'],
      incomeLimit: 120000,
      pros: 'Flexible payment options',
      cons: 'Requires two separate education courses'
    }
  ];

  const lenders = [
    {
      name: 'Elevations Credit Union',
      programs: ['chfa-grant', 'chfa-second', 'idf-boulder', 'boulder-h2o'],
      specialties: ['Stacked financing', 'Complex DPA cases'],
      rating: 4.8,
      avgDays: 42,
      phone: '(303) 555-1234'
    },
    {
      name: 'Premier Members Credit Union',
      programs: ['chfa-grant', 'chfa-second', 'metro-dpa', 'chac-loan'],
      specialties: ['Metro DPA expert', 'Fast processing'],
      rating: 4.7,
      avgDays: 38,
      phone: '(303) 555-2345'
    },
    {
      name: 'First Bank',
      programs: ['chfa-grant', 'chfa-second'],
      specialties: ['CHFA products only'],
      rating: 4.2,
      avgDays: 50,
      phone: '(303) 555-3456'
    },
    {
      name: 'Citywide Home Loans',
      programs: ['metro-dpa', 'chac-loan'],
      specialties: ['Metro area focus', 'Bilingual services'],
      rating: 4.5,
      avgDays: 45,
      phone: '(303) 555-4567'
    }
  ];

  // Check eligibility
  const getEligiblePrograms = () => {
    const income = parseInt(formData.income) || 0;
    const county = formData.location;

    return programs.filter(program => {
      // Income check
      if (income > program.incomeLimit) return false;

      // County check
      if (!program.counties.includes('all') && !program.counties.includes(county)) return false;

      // First-time buyer check
      if (program.requirements.includes('First-time buyer') && !formData.firstTimeBuyer) return false;

      return true;
    });
  };

  // Get matching lenders
  const getMatchingLenders = () => {
    if (formData.selectedPrograms.length === 0) return [];

    return lenders.filter(lender => {
      return formData.selectedPrograms.every(programId =>
        lender.programs.includes(programId)
      );
    }).sort((a, b) => b.rating - a.rating);
  };

  // Generate checklist
  const generateChecklist = () => {
    const selectedProgramObjs = programs.filter(p => formData.selectedPrograms.includes(p.id));
    const needsEducation = selectedProgramObjs.some(p =>
      p.requirements.some(r => r.toLowerCase().includes('education'))
    );
    const hasBoulderH2O = formData.selectedPrograms.includes('boulder-h2o');
    const hasCHAC = formData.selectedPrograms.includes('chac-loan');
    const hasIDF = formData.selectedPrograms.some(id => id.startsWith('idf-'));

    return {
      now: [
        needsEducation && {
          task: 'Complete CHFA Homebuyer Education Class',
          time: '8 hours (self-paced online available)',
          cost: '$75 (eHome America) or Free (Neighbor to Neighbor)',
          why: hasBoulderH2O
            ? 'REQUIRED BEFORE making an offer for Boulder H2O'
            : 'Required for most DPA programs',
          urgent: hasBoulderH2O
        },
        {
          task: 'Gather Required Documents',
          time: '2-3 hours',
          cost: 'Free',
          why: 'You\'ll need these for every application'
        },
        {
          task: 'Check Your Credit Score',
          time: '30 minutes',
          cost: 'Free (annualcreditreport.com)',
          why: 'Most programs require 620+ credit score'
        },
        hasCHAC && {
          task: 'Schedule CHAC Borrower Counseling',
          time: '1 hour session',
          cost: 'Free',
          why: 'Required in addition to general homebuyer education',
          note: 'Schedule 2 weeks in advance'
        }
      ].filter(Boolean),
      searching: [
        {
          task: 'Get Pre-Approved with Participating Lender',
          time: '1-2 weeks',
          why: 'Required before applying to most programs',
          note: 'Use lenders from our recommended list'
        },
        hasIDF && {
          task: 'Submit IDF Application',
          time: '4-6 weeks processing',
          why: 'Long processing time - start early',
          urgent: true
        },
        {
          task: 'Start House Hunting',
          why: 'Know your budget after pre-approval'
        }
      ].filter(Boolean),
      offer: [
        {
          task: 'Verify Program Funding Status',
          why: 'Programs can run out of money',
          note: 'Call each program to confirm funds available'
        },
        {
          task: 'Submit Final DPA Applications',
          time: '1-2 weeks',
          why: 'After offer accepted, before closing'
        },
        {
          task: 'Schedule Closing',
          time: '45-60 days typical with DPA',
          why: 'DPA processing adds time vs. conventional loan'
        }
      ]
    };
  };

  const documents = [
    { name: '2 years tax returns (1040 + all schedules)', programs: 'All programs' },
    { name: 'Last 30 days pay stubs', programs: 'All programs' },
    { name: '2 months bank statements', programs: 'All programs' },
    { name: 'Photo ID (driver\'s license)', programs: 'All programs' },
    { name: 'Social Security card', programs: 'All programs' },
    { name: 'Homebuyer education certificate', programs: 'Most DPA programs', optional: 'Complete education first' },
    { name: 'Pre-approval letter (Form 1003)', programs: 'Required for applications' },
    { name: 'Proof of first-generation homebuyer status', programs: 'CHFA enhanced assistance', optional: 'If applicable' }
  ];

  const steps = [
    'Tell Us About You',
    'Your Eligible Programs',
    'Select Programs',
    'Your Personalized Roadmap',
    'Recommended Lenders',
    'Education Requirements',
    'Document Checklist',
    'Feedback'
  ];

  const eligiblePrograms = getEligiblePrograms();
  const matchingLenders = getMatchingLenders();
  const checklist = formData.selectedPrograms.length > 0 ? generateChecklist() : null;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Home className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Colorado Homebuyer Navigator</h1>
        </div>
        <p className="text-gray-600">Get personalized guidance through your down payment assistance journey</p>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{steps[step]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Documents Dropdown - shown on steps 1-5 and 7, not on intake (0) or full doc checklist (6) */}
      {step > 0 && step !== 6 && (
        <DocumentsDropdown
          documents={documents}
          isOpen={showDocuments}
          onToggle={() => setShowDocuments(!showDocuments)}
        />
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6">

        {/* Step 0: Intake */}
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Tell us about your situation</h2>
            <p className="text-gray-600">This helps us show you relevant programs and create your personalized roadmap.</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where are you looking to buy?
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              >
                <option value="">Select a county...</option>
                <option value="Denver">Denver County</option>
                <option value="Boulder">Boulder County</option>
                <option value="Jefferson">Jefferson County</option>
                <option value="Adams">Adams County</option>
                <option value="Arapahoe">Arapahoe County</option>
                <option value="Larimer">Larimer County</option>
                <option value="El Paso">El Paso County</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual household income
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., 75000"
                value={formData.income}
                onChange={(e) => setFormData({...formData, income: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">Include all household income before taxes</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Household size
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.householdSize}
                onChange={(e) => setFormData({...formData, householdSize: e.target.value})}
              >
                <option value="1">1 person</option>
                <option value="2">2 people</option>
                <option value="3">3 people</option>
                <option value="4">4 people</option>
                <option value="5">5+ people</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Down payment saved
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., 10000"
                value={formData.downPaymentSaved}
                onChange={(e) => setFormData({...formData, downPaymentSaved: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated credit score
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.creditScore}
                onChange={(e) => setFormData({...formData, creditScore: e.target.value})}
              >
                <option value="">Select range...</option>
                <option value="750+">750+ (Excellent)</option>
                <option value="700-749">700-749 (Good)</option>
                <option value="650-699">650-699 (Fair)</option>
                <option value="620-649">620-649 (Minimum for most programs)</option>
                <option value="<620">Below 620</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="firstTime"
                className="w-5 h-5"
                checked={formData.firstTimeBuyer}
                onChange={(e) => setFormData({...formData, firstTimeBuyer: e.target.checked})}
              />
              <label htmlFor="firstTime" className="text-sm text-gray-700">
                I am a first-time homebuyer (or haven't owned in 3+ years)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="veteran"
                className="w-5 h-5"
                checked={formData.veteranStatus}
                onChange={(e) => setFormData({...formData, veteranStatus: e.target.checked})}
              />
              <label htmlFor="veteran" className="text-sm text-gray-700">
                I am a veteran or active military
              </label>
            </div>
          </div>
        )}

        {/* Step 1: Show Eligible Programs */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Programs You May Qualify For</h2>
              <p className="text-gray-600">Based on your income of ${parseInt(formData.income).toLocaleString()} and location in {formData.location} County.</p>
            </div>

            {eligiblePrograms.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">No programs found</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Based on your income and location, you may not qualify for these programs. Consider:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1 ml-4">
                      <li>• Checking other counties nearby</li>
                      <li>• USDA Rural Development loans (if buying outside metro areas)</li>
                      <li>• VA loans (if you're a veteran)</li>
                      <li>• Speaking with a HUD-approved housing counselor</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {eligiblePrograms.map(program => (
                <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{program.name}</h3>
                      <p className="text-blue-600 font-medium">{program.amount}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Eligible</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{program.description}</p>

                  <div className="grid md:grid-cols-2 gap-2 mb-3">
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-xs font-medium text-green-900">✓ Pros:</p>
                      <p className="text-xs text-green-700">{program.pros}</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <p className="text-xs font-medium text-red-900">✗ Cons:</p>
                      <p className="text-xs text-red-700">{program.cons}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p className="font-medium mb-1">Requirements:</p>
                    <ul className="space-y-1">
                      {program.requirements.map((req, idx) => (
                        <li key={idx}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {eligiblePrograms.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Next step:</strong> Select which programs you want to pursue, and we'll create your personalized application roadmap.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Programs */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select Programs to Pursue</h2>
              <p className="text-gray-600">Choose the programs you want to apply for. We'll check which can be combined and create your action plan.</p>
            </div>

            <div className="space-y-3">
              {eligiblePrograms.map(program => (
                <label
                  key={program.id}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.selectedPrograms.includes(program.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-1"
                    checked={formData.selectedPrograms.includes(program.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          selectedPrograms: [...formData.selectedPrograms, program.id]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          selectedPrograms: formData.selectedPrograms.filter(id => id !== program.id)
                        });
                      }
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{program.name}</p>
                    <p className="text-sm text-blue-600">{program.amount}</p>
                  </div>
                </label>
              ))}
            </div>

            {formData.selectedPrograms.includes('chfa-grant') && formData.selectedPrograms.includes('chfa-second') && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-900">Invalid Selection</p>
                    <p className="text-sm text-red-700 mt-1">
                      You can only choose ONE CHFA down payment assistance option. These cannot be combined.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.selectedPrograms.includes('chfa-grant') && formData.selectedPrograms.includes('metro-dpa') && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-900">Stacking Conflict</p>
                    <p className="text-sm text-red-700 mt-1">
                      CHFA Grant and MetroDPA typically cannot be combined because they're both "first lien" programs. Consider choosing one or the other.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.selectedPrograms.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-600">Select at least one program to continue</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Personalized Roadmap */}
        {step === 3 && checklist && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your Personalized Roadmap</h2>
              <p className="text-gray-600">Here's what you need to do, in order, to apply for your selected programs.</p>
            </div>

            {/* Phase 1: Do Now */}
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">PHASE 1</span>
                Do Now (Before House Hunting)
              </h3>
              <div className="space-y-3">
                {checklist.now.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.task}</p>
                        {item.time && <p className="text-sm text-gray-600 mt-1">⏱ {item.time}</p>}
                        {item.cost && <p className="text-sm text-gray-600">💵 {item.cost}</p>}
                        <p className="text-sm text-blue-600 mt-2"><strong>Why:</strong> {item.why}</p>
                        {item.note && (
                          <p className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded mt-2">
                            📌 {item.note}
                          </p>
                        )}
                        {item.urgent && (
                          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-2">
                            ⚠️ Critical - Do First
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 2: While Searching */}
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">PHASE 2</span>
                While House Hunting
              </h3>
              <div className="space-y-3">
                {checklist.searching.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.task}</p>
                        {item.time && <p className="text-sm text-gray-600 mt-1">⏱ {item.time}</p>}
                        <p className="text-sm text-blue-600 mt-2"><strong>Why:</strong> {item.why}</p>
                        {item.note && (
                          <p className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded mt-2">
                            📌 {item.note}
                          </p>
                        )}
                        {item.urgent && (
                          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-2">
                            ⚠️ Start Early - Long Processing Time
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 3: After Offer */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">PHASE 3</span>
                After Offer Accepted
              </h3>
              <div className="space-y-3">
                {checklist.offer.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.task}</p>
                        {item.time && <p className="text-sm text-gray-600 mt-1">⏱ {item.time}</p>}
                        <p className="text-sm text-blue-600 mt-2"><strong>Why:</strong> {item.why}</p>
                        {item.note && (
                          <p className="text-xs bg-blue-50 text-blue-800 p-2 rounded mt-2">
                            💡 {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>💾 Want to save this roadmap?</strong> In the full version, you could download this as a PDF or get it emailed to you to reference throughout your journey.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Recommended Lenders */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Recommended Lenders</h2>
              <p className="text-gray-600">These lenders accept ALL the programs you selected and specialize in DPA.</p>
            </div>

            {matchingLenders.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-900">Limited Lender Options</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      No single lender accepts all your selected programs. You may need to work with multiple lenders or adjust your program selection.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {matchingLenders.map((lender, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{lender.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(lender.rating) ? 'text-yellow-500' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{lender.rating}/5.0</span>
                      </div>
                    </div>
                    {idx === 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Top Rated</span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Specialties:</p>
                      {lender.specialties.map((spec, i) => (
                        <span key={i} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {spec}
                        </span>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Average Time to Close:</p>
                      <p className="font-medium text-gray-900">{lender.avgDays} days</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-900 mb-1">Contact:</p>
                    <p className="text-sm text-gray-700">{lender.phone}</p>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    <p className="font-medium mb-1">Accepts your programs:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.selectedPrograms.map(programId => {
                        const program = programs.find(p => p.id === programId);
                        return (
                          <span key={programId} className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            ✓ {program?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {matchingLenders.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>💡 Pro Tip:</strong> Get pre-approved with at least 2 lenders to compare rates and terms. These lenders won't charge application fees until you decide to move forward.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Education Requirements */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Education Requirements</h2>
              <p className="text-gray-600">Most DPA programs require homebuyer education. Here's what you need.</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-3">Required: General Homebuyer Education (8 hours)</h3>

              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">eHome America (Online)</h4>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Recommended</span>
                  </div>
                  <ul className="text-sm space-y-1 mb-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Self-paced, complete in 1-2 weeks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>CHFA-approved for all programs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>$75 total cost</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Available 24/7</span>
                    </li>
                  </ul>
                  <button className="text-sm text-blue-600 hover:underline">
                    → Visit ehomeamerica.org
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Neighbor to Neighbor (In-Person - Fort Collins)</h4>
                  <ul className="text-sm space-y-1 mb-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Free (donation suggested)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>In-person support and networking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span>Requires attending Saturday class</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {formData.selectedPrograms.includes('chac-loan') && (
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-3">Additional: CHAC Borrower Counseling (1 hour)</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    CHAC requires a separate 1-hour counseling session in addition to the general homebuyer class. This reviews your specific financial situation and CHAC's loan products.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Available by phone/video</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span>Schedule 2 weeks in advance</span>
                    </li>
                  </ul>
                  <p className="text-sm text-blue-600 mt-3">Call (303) 572-9445 to schedule</p>
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">✨ Future Feature: Gary CV Universal Certificate</h4>
              <p className="text-sm text-green-800">
                We're developing a Colorado-specific online homebuyer education course that would be accepted by ALL programs and cost just $25. Would you be interested in this?
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Document Checklist */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Document Checklist</h2>
              <p className="text-gray-600">Gather these documents now to speed up your applications later.</p>
            </div>

            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-600">{doc.programs}</p>
                    {doc.optional && (
                      <p className="text-xs text-blue-600 mt-1">💡 {doc.optional}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">✨ Future Feature: Secure Document Vault</h4>
              <p className="text-sm text-blue-800">
                In the full version, you could upload these documents once, and we'd verify completeness for each program and generate application packets automatically.
              </p>
              <p className="text-sm text-blue-800 mt-2">
                Would this save you time and reduce stress? Let us know in the feedback!
              </p>
            </div>
          </div>
        )}

        {/* Step 7: Feedback */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Help Us Build This Tool</h2>
              <p className="text-gray-600">Your feedback will shape whether and how we build this for Colorado families.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How helpful was this roadmap?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setFeedback({...feedback, helpful: rating})}
                    className={`w-12 h-12 rounded-lg border-2 font-bold transition-colors ${
                      feedback.helpful === rating
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Not helpful</span>
                <span>Very helpful</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What was most confusing or unclear?
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Be specific - this helps us improve..."
                value={feedback.clarity}
                onChange={(e) => setFeedback({...feedback, clarity: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Would you pay $25-50 for access to this tool with all features (document vault, lender matching, education tracking)?
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="wouldPay"
                    value="yes"
                    checked={feedback.wouldPay === 'yes'}
                    onChange={(e) => setFeedback({...feedback, wouldPay: e.target.value})}
                  />
                  <span className="text-sm">Yes, this would save me time and stress</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="wouldPay"
                    value="maybe"
                    checked={feedback.wouldPay === 'maybe'}
                    onChange={(e) => setFeedback({...feedback, wouldPay: e.target.value})}
                  />
                  <span className="text-sm">Maybe, depends on how much better than free options</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="wouldPay"
                    value="no"
                    checked={feedback.wouldPay === 'no'}
                    onChange={(e) => setFeedback({...feedback, wouldPay: e.target.value})}
                  />
                  <span className="text-sm">No, I'd only use it if free</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What features would make this most valuable to you?
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="e.g., 'Real-time program funding status', 'Text message reminders for deadlines', 'Direct connection to housing counselors'..."
                value={feedback.comments}
                onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                <strong>Thank you!</strong> Your feedback helps Gary Community Ventures decide whether to build this tool for Colorado families. We'll use your input to prioritize features that actually solve your problems.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-medium mb-2">Want to stay updated?</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              step === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={
              (step === 0 && !formData.location) ||
              (step === 2 && formData.selectedPrograms.length === 0) ||
              step === steps.length - 1
            }
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${
              (step === 0 && !formData.location) ||
              (step === 2 && formData.selectedPrograms.length === 0) ||
              step === steps.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {step === steps.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>This is a prototype tool by Gary Community Ventures</p>
        <p className="mt-1">Testing whether application support (not just program discovery) helps Colorado families</p>
      </div>
    </div>
  );
};

export default ColoradoHomebuyerNavigator;
