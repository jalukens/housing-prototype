import { useState, useMemo } from 'react'
import { getEligiblePrograms, generateCombinations, programs } from '@/data/programs'
import { getMatchingLenders } from '@/data/lenders'
import { assessCreditReadiness } from '@/data/constants'

const initialFormData = {
  // Profile
  location: '',
  income: '',
  householdSize: '1',
  firstTimeBuyer: true,
  downPaymentSaved: '',
  creditScore: '',
  occupation: '',
  veteranStatus: false,
  // Selections
  selectedPrograms: [],
  selectedPath: null, // 'dpa' or 'affordable'
  purchasePrice: '',
  // Additional
  recommendedLender: null
}

export function useNavigator() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState(initialFormData)
  const [expandedPackages, setExpandedPackages] = useState({})

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const eligiblePrograms = useMemo(() => {
    return getEligiblePrograms(formData)
  }, [formData.location, formData.income, formData.firstTimeBuyer, formData.occupation, formData.veteranStatus])

  const dpaPrograms = useMemo(() => {
    return eligiblePrograms.filter(p => !p.isAffordableHousing)
  }, [eligiblePrograms])

  const affordablePrograms = useMemo(() => {
    return eligiblePrograms.filter(p => p.isAffordableHousing)
  }, [eligiblePrograms])

  const packages = useMemo(() => {
    const income = parseInt(formData.income) || 0
    const downPaymentSaved = parseInt(formData.downPaymentSaved) || 0
    const estimatedPrice = Math.min(income * 4.5, 600000)

    const combinations = generateCombinations(dpaPrograms)

    const calculatePayment = (homePrice, assistanceAmount) => {
      const totalDown = downPaymentSaved + assistanceAmount
      const loanAmount = Math.max(0, homePrice - totalDown)
      const rate = 0.0675
      const monthlyRate = rate / 12
      const numPayments = 360
      let payment = 0
      if (loanAmount > 0) {
        payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                  (Math.pow(1 + monthlyRate, numPayments) - 1)
      }
      const taxes = (homePrice * 0.007) / 12
      const insurance = 150
      return Math.round(payment + taxes + insurance)
    }

    return combinations.map(combo => {
      const progs = combo.map(id => {
        const p = programs.find(pr => pr.id === id)
        return {
          id: p.id,
          name: p.name,
          amount: p.calcAmount ? p.calcAmount(estimatedPrice) : 0,
          isGrant: p.isGrant,
          pros: p.pros,
          cons: p.cons,
          description: p.description,
          requirements: p.requirements,
          yearsToForgiveness: p.yearsToForgiveness
        }
      })
      const totalAssistance = progs.reduce((sum, p) => sum + p.amount, 0)
      const monthlyPayment = calculatePayment(estimatedPrice, totalAssistance)
      const yourDownPayment = Math.max(0, Math.round(estimatedPrice * 0.035 - totalAssistance))

      return {
        programs: progs,
        totalAssistance,
        monthlyPayment,
        yourDownPayment,
        estimatedPrice
      }
    }).sort((a, b) => b.totalAssistance - a.totalAssistance).slice(0, 4)
  }, [dpaPrograms, formData.income, formData.downPaymentSaved])

  const matchingLenders = useMemo(() => {
    return getMatchingLenders(formData.selectedPrograms)
  }, [formData.selectedPrograms])

  const creditAssessment = useMemo(() => {
    return assessCreditReadiness(formData.creditScore)
  }, [formData.creditScore])

  const affordability = useMemo(() => {
    const income = parseInt(formData.income) || 0
    const downPaymentSaved = parseInt(formData.downPaymentSaved) || 0
    const maxPrice = Math.min(income * 4.5, 600000)

    const loanAmount = maxPrice * 0.965
    const rate = 0.0675
    const monthlyRate = rate / 12
    const numPayments = 360
    let monthlyPI = 0
    if (loanAmount > 0) {
      monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1)
    }
    const taxes = (maxPrice * 0.007) / 12
    const insurance = 150
    const totalMonthly = Math.round(monthlyPI + taxes + insurance)

    return {
      maxPrice,
      monthlyPayment: totalMonthly,
      downPaymentSaved,
      requiredDown: Math.round(maxPrice * 0.035)
    }
  }, [formData.income, formData.downPaymentSaved])

  const canProceed = () => {
    if (step === 0) return formData.location && formData.income && formData.creditScore
    if (step === 1) return true
    if (step === 2) return true
    if (step === 3) return true
    if (step === 4) return true
    if (step === 5) return true
    if (step === 6) return true
    if (step === 7) return true
    return false
  }

  const selectPackage = (pkg) => {
    updateFormData({
      purchasePrice: pkg.estimatedPrice.toString(),
      selectedPrograms: pkg.programs.map(p => p.id)
    })
  }

  return {
    step,
    setStep,
    formData,
    updateFormData,
    eligiblePrograms,
    dpaPrograms,
    affordablePrograms,
    packages,
    matchingLenders,
    creditAssessment,
    affordability,
    canProceed,
    selectPackage,
    expandedPackages,
    setExpandedPackages
  }
}
