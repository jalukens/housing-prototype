export const COLORADO_COUNTIES = [
  'Adams', 'Alamosa', 'Arapahoe', 'Archuleta', 'Baca', 'Bent', 'Boulder',
  'Broomfield', 'Chaffee', 'Cheyenne', 'Clear Creek', 'Conejos', 'Costilla',
  'Crowley', 'Custer', 'Delta', 'Denver', 'Dolores', 'Douglas', 'Eagle',
  'El Paso', 'Elbert', 'Fremont', 'Garfield', 'Gilpin', 'Grand', 'Gunnison',
  'Hinsdale', 'Huerfano', 'Jackson', 'Jefferson', 'Kiowa', 'Kit Carson',
  'La Plata', 'Lake', 'Larimer', 'Las Animas', 'Lincoln', 'Logan', 'Mesa',
  'Mineral', 'Moffat', 'Montezuma', 'Montrose', 'Morgan', 'Otero', 'Ouray',
  'Park', 'Phillips', 'Pitkin', 'Prowers', 'Pueblo', 'Rio Blanco', 'Rio Grande',
  'Routt', 'Saguache', 'San Juan', 'San Miguel', 'Sedgwick', 'Summit', 'Teller',
  'Washington', 'Weld', 'Yuma'
]

export const CREDIT_SCORE_RANGES = [
  { value: 'below-620', label: 'Below 620', min: 0, max: 619 },
  { value: '620-659', label: '620-659', min: 620, max: 659 },
  { value: '660-699', label: '660-699', min: 660, max: 699 },
  { value: '700-739', label: '700-739', min: 700, max: 739 },
  { value: '740+', label: '740+', min: 740, max: 850 }
]

export const OCCUPATIONS = [
  { value: '', label: 'None of the below' },
  { value: 'teacher', label: 'Teacher / Educator' },
  { value: 'first-responder', label: 'First Responder (Fire, Police, EMS)' },
  { value: 'healthcare', label: 'Healthcare Worker' },
  { value: 'nonprofit', label: 'Nonprofit Employee' },
  { value: 'farmer', label: 'Farmer / Rancher' }
]

export const HOUSEHOLD_SIZES = [
  { value: '1', label: '1 person' },
  { value: '2', label: '2 people' },
  { value: '3', label: '3 people' },
  { value: '4', label: '4 people' },
  { value: '5', label: '5 people' },
  { value: '6', label: '6 people' },
  { value: '7', label: '7 people' },
  { value: '8', label: '8+ people' }
]

export const STEPS = [
  { id: 0, name: 'Your Profile', description: 'Tell us about yourself' },
  { id: 1, name: 'What You Qualify For', description: 'See your buying power' },
  { id: 2, name: 'Assistance Packages', description: 'Choose your path' },
  { id: 3, name: 'Your Roadmap', description: 'Overview of the journey' },
  { id: 4, name: 'Prepare', description: 'Get ready to buy' },
  { id: 5, name: 'Select Realtor', description: 'Find your agent' },
  { id: 6, name: 'Get Pre-Approved', description: 'Work with lenders' },
  { id: 7, name: 'Apply for DPA', description: 'Submit applications' },
  { id: 8, name: 'Feedback', description: 'Help us improve' }
]

export const assessCreditReadiness = (creditScore) => {
  if (!creditScore) return { status: 'unknown', message: 'Please enter your credit score' }

  const score = creditScore
  if (score === 'below-620') {
    return {
      status: 'not-ready',
      message: 'Most DPA programs require 620+ credit score',
      approvalRate: 15,
      color: 'red'
    }
  }
  if (score === '620-659') {
    return {
      status: 'challenging',
      message: 'You meet minimum requirements but may face higher rates',
      approvalRate: 45,
      color: 'amber'
    }
  }
  if (score === '660-699') {
    return {
      status: 'good',
      message: 'Good credit - eligible for most programs',
      approvalRate: 70,
      color: 'yellow'
    }
  }
  if (score === '700-739') {
    return {
      status: 'very-good',
      message: 'Very good credit - best rates available',
      approvalRate: 85,
      color: 'green'
    }
  }
  return {
    status: 'excellent',
    message: 'Excellent credit - premium rates and easy approval',
    approvalRate: 95,
    color: 'green'
  }
}
