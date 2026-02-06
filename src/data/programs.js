export const programs = [
  {
    id: 'chfa-grant',
    name: 'CHFA Down Payment Grant',
    amount: 'Up to $25,000 (3% of loan)',
    description: 'Grant (no repayment) paired with CHFA first mortgage',
    requirements: ['First-time buyer', 'CHFA mortgage', 'Income limits apply'],
    counties: ['all'],
    incomeLimit: 140000,
    pros: 'No repayment required',
    cons: 'Higher interest rate on mortgage',
    isGrant: true,
    calcAmount: (price) => Math.min(price * 0.03, 25000),
    rateAdder: 0.004,
    yearsToForgiveness: 0,
    isDeferred: false,
    processingWeeks: 4,
    category: 'state'
  },
  {
    id: 'chfa-second',
    name: 'CHFA Second Mortgage',
    amount: 'Up to $25,000 (4% of loan)',
    description: 'Silent second mortgage, deferred payment',
    requirements: ['First-time buyer', 'CHFA mortgage'],
    counties: ['all'],
    incomeLimit: 140000,
    pros: 'No monthly payments, lower rate than grant',
    cons: 'Must repay when you sell or refinance',
    isGrant: false,
    calcAmount: (price) => Math.min(price * 0.04, 25000),
    rateAdder: 0,
    yearsToForgiveness: null,
    isDeferred: true,
    processingWeeks: 4,
    category: 'state'
  },
  {
    id: 'metro-dpa',
    name: 'Metro DPA',
    amount: 'Up to $15,000',
    description: 'Down payment assistance for Denver metro area buyers',
    requirements: ['Metro area property', 'Income limits', 'Homebuyer education'],
    counties: ['Denver', 'Adams', 'Arapahoe', 'Jefferson', 'Douglas', 'Broomfield'],
    incomeLimit: 130000,
    pros: 'Forgivable after 5 years',
    cons: 'Limited to metro counties',
    isGrant: false,
    calcAmount: (price) => Math.min(price * 0.04, 15000),
    rateAdder: 0.002,
    yearsToForgiveness: 5,
    isDeferred: false,
    processingWeeks: 3,
    category: 'local'
  },
  {
    id: 'chac-loan',
    name: 'CHAC Down Payment Loan',
    amount: 'Up to $20,000',
    description: 'Colorado Housing Assistance Corp deferred loan',
    requirements: ['First-time buyer', 'CHAC counseling', 'Income limits'],
    counties: ['Denver', 'Adams', 'Arapahoe', 'Jefferson'],
    incomeLimit: 120000,
    pros: '0% interest, deferred',
    cons: 'Requires additional counseling session',
    isGrant: false,
    calcAmount: (price) => Math.min(price * 0.05, 20000),
    rateAdder: 0,
    yearsToForgiveness: null,
    isDeferred: true,
    processingWeeks: 5,
    category: 'nonprofit'
  },
  {
    id: 'idf-boulder',
    name: 'IDF Boulder County',
    amount: 'Up to $15,000',
    description: 'Impact Development Fund assistance for Boulder County',
    requirements: ['Boulder County property', 'Income limits', 'First-time or targeted buyer'],
    counties: ['Boulder'],
    incomeLimit: 125000,
    pros: 'Forgivable after 3 years',
    cons: 'Long processing time (6+ weeks)',
    isGrant: false,
    calcAmount: (price) => Math.min(price * 0.04, 15000),
    rateAdder: 0,
    yearsToForgiveness: 3,
    isDeferred: false,
    processingWeeks: 6,
    category: 'local'
  },
  {
    id: 'boulder-h2o',
    name: 'Boulder Homeownership Opportunity',
    amount: 'Up to $50,000',
    description: 'City of Boulder shared equity DPA',
    requirements: ['Boulder city limits', 'Income 80% AMI', 'Education BEFORE offer'],
    counties: ['Boulder'],
    incomeLimit: 95000,
    pros: 'Very high assistance amount',
    cons: 'Must complete education before making offer, shared equity',
    isGrant: false,
    calcAmount: (price) => Math.min(price * 0.10, 50000),
    rateAdder: 0,
    yearsToForgiveness: null,
    isDeferred: true,
    processingWeeks: 8,
    category: 'local'
  },
  {
    id: 'va-loan',
    name: 'VA Home Loan',
    amount: '0% down payment',
    description: 'Zero down payment loan for veterans and military',
    requirements: ['Eligible veteran/active duty', 'VA Certificate of Eligibility', 'Primary residence'],
    counties: ['all'],
    incomeLimit: 999999,
    occupation: 'veteran',
    pros: 'No down payment, no PMI, competitive rates',
    cons: 'VA funding fee (can be financed)',
    isGrant: false,
    calcAmount: (price) => 0,
    rateAdder: -0.002,
    yearsToForgiveness: null,
    isDeferred: false,
    processingWeeks: 4,
    category: 'federal'
  },
  {
    id: 'usda-rural',
    name: 'USDA Rural Development',
    amount: '0% down payment',
    description: 'Zero down payment for eligible rural areas',
    requirements: ['USDA-eligible area', 'Income limits (115% AMI)', 'Primary residence'],
    counties: ['Weld', 'Larimer', 'El Paso', 'Pueblo', 'Mesa', 'Garfield'],
    incomeLimit: 110000,
    pros: 'No down payment, below-market rates',
    cons: 'Property must be in eligible rural area',
    isGrant: false,
    calcAmount: (price) => 0,
    rateAdder: -0.003,
    yearsToForgiveness: null,
    isDeferred: false,
    processingWeeks: 6,
    category: 'federal'
  },
  // Affordable Housing Programs
  {
    id: 'elevation-clt',
    name: 'Elevation Community Land Trust',
    amount: '20-40% below market price',
    description: 'Buy a home at 20-40% below market value. You own the home, the trust owns the land.',
    requirements: ['Income at or below 80% AMI', 'First-time buyer preferred', 'Homebuyer education', 'Primary residence'],
    counties: ['Denver', 'Adams', 'Arapahoe', 'Jefferson', 'Boulder', 'Broomfield'],
    incomeLimit: 85000,
    pros: 'Dramatically lower purchase price, permanently affordable, build some equity',
    cons: 'Limited appreciation (25% of increase), land lease fee (~$50-75/mo), resale restrictions',
    isGrant: false,
    calcAmount: (price) => price * 0.30,
    rateAdder: 0,
    yearsToForgiveness: null,
    isDeferred: false,
    processingWeeks: 8,
    category: 'affordable-housing',
    isAffordableHousing: true,
    programType: 'Community Land Trust'
  },
  {
    id: 'habitat-humanity',
    name: 'Habitat for Humanity Colorado',
    amount: '0% interest mortgage + sweat equity',
    description: 'Affordable homes with 0% interest loans. Requires sweat equity hours building homes.',
    requirements: ['Income 30-60% AMI', 'Able to pay affordable mortgage', '200-400 sweat equity hours', 'Housing need demonstrated'],
    counties: ['all'],
    incomeLimit: 64000,
    pros: 'Zero interest mortgage, very low monthly payments, new construction, community building',
    cons: 'Significant time commitment (sweat equity), long waitlists, limited availability',
    isGrant: false,
    calcAmount: (price) => price * 0.40,
    rateAdder: -0.065,
    yearsToForgiveness: null,
    isDeferred: false,
    processingWeeks: 52,
    category: 'affordable-housing',
    isAffordableHousing: true,
    programType: 'Nonprofit Homeownership'
  },
  {
    id: 'denver-shared-equity',
    name: 'Denver Shared Equity Program',
    amount: 'Up to $50,000 + below-market homes',
    description: 'City program combining DPA with deed-restricted affordable homes in Denver.',
    requirements: ['Income at or below 80% AMI', 'First-time buyer', 'Denver resident or worker', 'Homebuyer education'],
    counties: ['Denver'],
    incomeLimit: 85000,
    pros: 'Combines DPA with affordable pricing, city-backed program, multiple neighborhoods',
    cons: 'Resale price restrictions, must remain primary residence, limited inventory',
    isGrant: false,
    calcAmount: (price) => 50000,
    rateAdder: 0,
    yearsToForgiveness: 15,
    isDeferred: true,
    processingWeeks: 8,
    category: 'affordable-housing',
    isAffordableHousing: true,
    programType: 'Shared Equity'
  },
  // Occupation-specific programs
  {
    id: 'teacher-next-door',
    name: 'Teacher Next Door',
    amount: 'Up to $10,000 grant',
    description: 'Down payment assistance for K-12 teachers and staff',
    requirements: ['Licensed teacher or school employee', 'Full-time employment', 'First-time or repeat buyer'],
    counties: ['all'],
    incomeLimit: 150000,
    pros: 'Grant does not need to be repaid',
    cons: 'Must verify employment annually for 3 years',
    isGrant: true,
    calcAmount: () => 10000,
    rateAdder: 0,
    yearsToForgiveness: 0,
    isDeferred: false,
    processingWeeks: 3,
    occupation: 'teacher',
    category: 'occupation'
  },
  {
    id: 'homes-for-heroes',
    name: 'Homes for Heroes',
    amount: 'Up to $3,000 rebate',
    description: 'Rebate program for first responders, military, healthcare, teachers',
    requirements: ['Eligible occupation', 'Use participating agent/lender'],
    counties: ['all'],
    incomeLimit: 999999,
    pros: 'Cash back at closing, works with other programs',
    cons: 'Must use specific agents/lenders',
    isGrant: true,
    calcAmount: () => 3000,
    rateAdder: 0,
    yearsToForgiveness: 0,
    isDeferred: false,
    processingWeeks: 2,
    occupation: ['teacher', 'first-responder', 'healthcare'],
    category: 'occupation'
  },
  {
    id: 'healthcare-heroes',
    name: 'Healthcare Worker Housing',
    amount: 'Up to $5,000 grant',
    description: 'Down payment assistance for nurses, doctors, and healthcare workers',
    requirements: ['Healthcare professional', 'Full-time employment', 'First-time or repeat buyer'],
    counties: ['all'],
    incomeLimit: 180000,
    pros: 'Available to both first-time and repeat buyers',
    cons: 'Must verify healthcare employment',
    isGrant: true,
    calcAmount: () => 5000,
    rateAdder: 0,
    yearsToForgiveness: 0,
    isDeferred: false,
    processingWeeks: 3,
    occupation: 'healthcare',
    category: 'occupation'
  }
]

export const getEligiblePrograms = (formData) => {
  const income = parseInt(formData.income) || 0
  const county = formData.location
  const occupation = formData.occupation
  const isVeteran = formData.veteranStatus

  return programs.filter(program => {
    if (income > program.incomeLimit) return false
    if (!program.counties.includes('all') && !program.counties.includes(county)) return false
    if (program.requirements.includes('First-time buyer') && !formData.firstTimeBuyer) return false

    if (program.occupation) {
      if (program.id === 'va-loan' && !isVeteran) return false
      if (program.id !== 'va-loan') {
        const requiredOccupations = Array.isArray(program.occupation) ? program.occupation : [program.occupation]
        if (!occupation || !requiredOccupations.includes(occupation)) return false
      }
    }

    return true
  })
}

export const generateCombinations = (eligiblePrograms) => {
  const nonAffordable = eligiblePrograms.filter(p => !p.isAffordableHousing)
  const combinations = []

  // Single programs
  nonAffordable.forEach(p => {
    combinations.push([p.id])
  })

  // Two-program combinations
  for (let i = 0; i < nonAffordable.length; i++) {
    for (let j = i + 1; j < nonAffordable.length; j++) {
      const combo = [nonAffordable[i].id, nonAffordable[j].id]
      if (isValidCombination(combo)) {
        combinations.push(combo)
      }
    }
  }

  return combinations
}

export const isValidCombination = (programIds) => {
  const hasCHFAGrant = programIds.includes('chfa-grant')
  const hasCHFASecond = programIds.includes('chfa-second')
  const hasMetroDPA = programIds.includes('metro-dpa')

  if (hasCHFAGrant && hasCHFASecond) return false
  if ((hasCHFAGrant || hasCHFASecond) && hasMetroDPA) return false

  return true
}
