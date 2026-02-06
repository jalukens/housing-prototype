export const realtors = [
  {
    id: 'maria-santos',
    name: 'Maria Santos',
    company: 'Keller Williams Realty',
    phone: '(303) 555-0123',
    email: 'maria@example.com',
    specialties: ['First-time buyers', 'DPA programs', 'Spanish-speaking'],
    counties: ['Denver', 'Adams', 'Arapahoe'],
    rating: 4.9,
    dpaTransactions: 45,
    languages: ['English', 'Spanish'],
    photo: null
  },
  {
    id: 'james-mitchell',
    name: 'James Mitchell',
    company: 'RE/MAX Alliance',
    phone: '(303) 555-0456',
    email: 'james@example.com',
    specialties: ['First-time buyers', 'Affordable housing', 'CLT properties'],
    counties: ['Boulder', 'Broomfield', 'Jefferson'],
    rating: 4.8,
    dpaTransactions: 32,
    languages: ['English'],
    photo: null
  },
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    company: 'Compass Colorado',
    phone: '(720) 555-0789',
    email: 'sarah@example.com',
    specialties: ['DPA transactions', 'New construction', 'Condos'],
    counties: ['Denver', 'Jefferson', 'Douglas'],
    rating: 4.7,
    dpaTransactions: 58,
    languages: ['English'],
    photo: null
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    company: 'eXp Realty',
    phone: '(303) 555-0147',
    email: 'michael@example.com',
    specialties: ['First-time buyers', 'Investment properties', 'Multilingual'],
    counties: ['Denver', 'Arapahoe', 'Adams'],
    rating: 4.8,
    dpaTransactions: 28,
    languages: ['English', 'Mandarin', 'Cantonese'],
    photo: null
  },
  {
    id: 'lisa-martinez',
    name: 'Lisa Martinez',
    company: 'The Group Real Estate',
    phone: '(970) 555-0258',
    email: 'lisa@example.com',
    specialties: ['Northern Colorado', 'First-time buyers', 'Rural properties'],
    counties: ['Larimer', 'Weld'],
    rating: 4.9,
    dpaTransactions: 41,
    languages: ['English', 'Spanish'],
    photo: null
  },
  {
    id: 'david-thompson',
    name: 'David Thompson',
    company: 'Coldwell Banker',
    phone: '(719) 555-0369',
    email: 'david@example.com',
    specialties: ['Southern Colorado', 'DPA programs', 'Military families'],
    counties: ['El Paso', 'Pueblo'],
    rating: 4.7,
    dpaTransactions: 36,
    languages: ['English'],
    photo: null
  },
  {
    id: 'jennifer-williams',
    name: 'Jennifer Williams',
    company: "LIV Sotheby's",
    phone: '(970) 555-0471',
    email: 'jennifer@example.com',
    specialties: ['Mountain communities', 'Deed-restricted housing', 'Workforce housing'],
    counties: ['Summit', 'Eagle', 'Pitkin', 'Routt'],
    rating: 4.8,
    dpaTransactions: 22,
    languages: ['English'],
    photo: null
  },
  {
    id: 'amanda-rodriguez',
    name: 'Amanda Rodriguez',
    company: 'HomeSmart Realty',
    phone: '(303) 555-0582',
    email: 'amanda@example.com',
    specialties: ['First-time buyers', 'FHA loans', 'DPA specialist'],
    counties: ['Denver', 'Adams', 'Arapahoe', 'Jefferson'],
    rating: 4.9,
    dpaTransactions: 67,
    languages: ['English', 'Spanish'],
    photo: null
  }
]

export const getRealtorsByCounty = (county) => {
  if (!county) return realtors
  return realtors.filter(r => r.counties.includes(county))
}

export const getRealtorsForCounty = getRealtorsByCounty
