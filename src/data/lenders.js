export const lenders = [
  {
    id: 'bellco',
    name: 'Bellco Credit Union',
    type: 'Credit Union',
    programs: ['chfa-grant', 'chfa-second', 'metro-dpa', 'chac-loan'],
    specialties: ['First-time buyers', 'DPA expert', 'Member-focused rates'],
    rating: 4.7,
    dpaLoansYTD: 156,
    avgDays: 45,
    phone: '(303) 689-7800',
    website: 'https://www.bellco.org',
    counties: ['all'],
    notes: 'Member-owned credit union with competitive rates'
  },
  {
    id: 'elevations',
    name: 'Elevations Credit Union',
    type: 'Credit Union',
    programs: ['chfa-grant', 'chfa-second', 'idf-boulder', 'boulder-h2o'],
    specialties: ['Boulder expert', 'Local decision making', 'Green building'],
    rating: 4.8,
    dpaLoansYTD: 89,
    avgDays: 42,
    phone: '(303) 443-4672',
    website: 'https://www.elevationscu.com',
    counties: ['Boulder', 'Broomfield', 'Larimer', 'Weld'],
    notes: 'Best for Boulder County buyers'
  },
  {
    id: 'ent',
    name: 'Ent Credit Union',
    type: 'Credit Union',
    programs: ['chfa-grant', 'chfa-second', 'va-loan'],
    specialties: ['Military families', 'Southern Colorado', 'VA Loans'],
    rating: 4.6,
    dpaLoansYTD: 112,
    avgDays: 44,
    phone: '(719) 574-1100',
    website: 'https://www.ent.com',
    counties: ['El Paso', 'Pueblo', 'Teller'],
    notes: 'Strong VA lending, Colorado Springs focus'
  },
  {
    id: 'citywide',
    name: 'Citywide Home Loans',
    type: 'Mortgage Company',
    programs: ['chfa-grant', 'chfa-second', 'metro-dpa', 'chac-loan', 'idf-boulder'],
    specialties: ['DPA specialists', 'Bilingual loan officers', 'Fast closings'],
    rating: 4.6,
    dpaLoansYTD: 234,
    avgDays: 40,
    phone: '(303) 285-2100',
    website: 'https://www.citywidehomeloans.com',
    counties: ['all'],
    notes: 'One of the largest DPA originators in Colorado'
  },
  {
    id: 'firstbank',
    name: 'FirstBank',
    type: 'Bank',
    programs: ['chfa-grant', 'chfa-second', 'metro-dpa'],
    specialties: ['Colorado-based', 'Community focused', 'Local decisions'],
    rating: 4.5,
    dpaLoansYTD: 145,
    avgDays: 47,
    phone: '(303) 761-1600',
    website: 'https://www.efirstbank.com',
    counties: ['all'],
    notes: 'Colorado-headquartered community bank'
  },
  {
    id: 'cherry-creek',
    name: 'Cherry Creek Mortgage',
    type: 'Mortgage Company',
    programs: ['chfa-grant', 'chfa-second', 'idf-boulder', 'metro-dpa', 'chac-loan'],
    specialties: ['Full-service broker', 'Stacked financing expert'],
    rating: 4.8,
    dpaLoansYTD: 198,
    avgDays: 43,
    phone: '(303) 813-3100',
    website: 'https://www.cherrycreekmortgage.com',
    counties: ['all'],
    notes: 'Highly rated for complex DPA scenarios'
  },
  {
    id: 'fairway',
    name: 'Fairway Independent Mortgage',
    type: 'Mortgage Company',
    programs: ['chfa-grant', 'chfa-second', 'metro-dpa', 'va-loan', 'homes-for-heroes'],
    specialties: ['Technology-enabled process', 'Fast approvals', 'Homes for Heroes partner'],
    rating: 4.4,
    dpaLoansYTD: 167,
    avgDays: 42,
    phone: '(720) 428-4000',
    website: 'https://www.fairwaymc.com',
    counties: ['all'],
    notes: 'Multiple branch locations statewide'
  },
  {
    id: 'guild',
    name: 'Guild Mortgage',
    type: 'Mortgage Company',
    programs: ['chfa-grant', 'chfa-second', 'va-loan', 'usda-rural'],
    specialties: ['National reach', 'Government loan expert', 'VA/FHA Specialist'],
    rating: 4.2,
    dpaLoansYTD: 123,
    avgDays: 48,
    phone: '(720) 515-5900',
    website: 'https://www.guildmortgage.com',
    counties: ['all'],
    notes: 'Strong FHA/VA expertise'
  },
  {
    id: 'nbh',
    name: 'NBH Bank',
    type: 'Bank',
    programs: ['chfa-grant', 'chfa-second', 'metro-dpa', 'chac-loan'],
    specialties: ['Bilingual services', 'Diverse communities'],
    rating: 4.5,
    dpaLoansYTD: 78,
    avgDays: 46,
    phone: '(303) 256-3500',
    website: 'https://www.nbhbank.com',
    counties: ['Denver', 'Adams', 'Jefferson'],
    notes: 'Spanish-language services available'
  },
  {
    id: 'colorado-mortgage',
    name: 'Colorado Mortgage Company',
    type: 'Mortgage Company',
    programs: ['chfa-grant', 'chfa-second', 'metro-dpa', 'idf-boulder'],
    specialties: ['Colorado-only focus', 'Complex financing'],
    rating: 4.7,
    dpaLoansYTD: 189,
    avgDays: 41,
    phone: '(303) 862-5626',
    website: 'https://www.coloradomortgagecompany.com',
    counties: ['all'],
    notes: 'Exclusively serves Colorado borrowers'
  }
]

export const getMatchingLenders = (selectedPrograms) => {
  if (!selectedPrograms || selectedPrograms.length === 0) return lenders

  return lenders.filter(lender =>
    selectedPrograms.some(programId => lender.programs.includes(programId))
  ).sort((a, b) => b.rating - a.rating)
}

export const getLendersByPrograms = (selectedPrograms) => {
  if (!selectedPrograms || selectedPrograms.length === 0) return lenders

  return lenders.filter(lender =>
    selectedPrograms.some(programId => lender.programs.includes(programId))
  ).sort((a, b) => b.rating - a.rating)
}

export const getLenderMatch = (programIds) => {
  if (!programIds || programIds.length === 0) return null

  const compatibleLenders = lenders.filter(lender =>
    programIds.every(pid => lender.programs.includes(pid))
  )

  const sortedLenders = compatibleLenders.sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating
    return a.avgDays - b.avgDays
  })

  if (sortedLenders.length === 0) {
    return { type: 'none', lenders: [] }
  }

  if (sortedLenders.length >= 3) {
    return { type: 'multiple', lenders: sortedLenders.slice(0, 3) }
  }

  return { type: 'single', lender: sortedLenders[0] }
}
