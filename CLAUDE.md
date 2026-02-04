# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Colorado Homebuyer Navigator - a React prototype that guides users through finding and applying for down payment assistance (DPA) programs in Colorado. Built for Gary Community Ventures to test whether application support (beyond program discovery) helps Colorado families.

## Tech Stack

- React 18 with hooks (useState, useMemo)
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- ESLint for linting

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Quick Start (No Build Required)

Open `index-standalone.html` directly in a browser - it loads React, Tailwind, and Lucide from CDNs.

## Architecture

The application is a single-component multi-step wizard (`ColoradoHomebuyerNavigator`) with 9 steps:
1. User intake (location, income, purchase price, down payment, stay duration, priority)
2. Display eligible programs
3. **Recommended Package** (AI-powered recommendations based on user priority)
4. Manual program selection (optional - if user clicks "Pick My Own")
5. Personalized roadmap (phased checklist)
6. Lender recommendations
7. Education requirements
8. Document checklist
9. Feedback collection

### Key Data Structures

- `programs[]` - DPA program definitions with eligibility rules, calculation functions, and metadata
- `lenders[]` - Lender data with program compatibility, ratings, and contact info
- `formData` - User input state including new fields: `purchasePrice`, `stayDuration`, `priority`
- `feedback` - User feedback state for prototype validation

### Recommendation Engine

The `calculateRecommendations()` function (memoized) powers the recommendation system:

1. **Generates valid combinations** via `generateCombinations()` - creates all subsets of up to 3 programs, filtering by stacking rules

2. **Calculates metrics** via `calculateCombinationMetrics()`:
   - Total assistance amount (using each program's `calcAmount()` function)
   - Monthly payment (30-year fixed at base 6.25% + program rate adjusters)
   - Years to forgiveness
   - Complexity score
   - Down payment needed

3. **Scores combinations** via `scoreCombination()` based on user's priority:
   - `max-assistance`: Highest total assistance wins
   - `low-payment`: Lowest monthly payment wins
   - `fast-forgiveness`: Immediate grants > forgivable loans > deferred
   - `simple`: Fewest applications and complications wins

4. Returns top 3 recommendations with full metrics

### Program Stacking Rules

Programs are checked via `isValidCombination()`:
- CHFA Grant and CHFA Second Mortgage are mutually exclusive
- CHFA (either) and MetroDPA are mutually exclusive
- Maximum 3 programs per combination

### Eligibility Logic

`getEligiblePrograms()` filters programs by:
- Income vs. `incomeLimit`
- County match (some programs are statewide via `counties: ['all']`)
- First-time buyer requirement

`getMatchingLenders()` returns lenders that support ALL selected programs.

`generateChecklist()` builds a phased action plan based on selected programs, with special handling for programs requiring education before making offers (Boulder H2O) or additional counseling (CHAC).

### Navigation Flow

- From Step 2 (Recommendations): User can either select a package (skips to roadmap) or click "Pick My Own" (goes to manual selection)
- `pickedOwnPrograms` state tracks whether user chose a recommendation or manual selection
- Back navigation respects this choice
