export interface Criterion {
  id: string
  name: string
  description: string
  weight: number
  options: CriterionOption[]
}

export interface CriterionOption {
  id: string
  label: string
  value: number
  description?: string
}

export interface PlatformType {
  id: string
  name: string
  description: string
  criteria: Criterion[]
}

export interface CalculationResult {
  criteriaScores: {
    criterionId: string
    criterionName: string
    weight: number
    selectedOption: CriterionOption
    weightedScore: number
  }[]
  totalScore: number
  recommendation: string
  platformType: PlatformType
}

export interface AppRequest {
  id: string
  name: string
  description: string
  platformTypeId: string
  requestDate: string
  requestor: string
  status: "pending" | "approved" | "rejected"
  calculationResult?: CalculationResult
}
