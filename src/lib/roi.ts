export interface RoiInputs {
  currentProcessCost: number    // R$/mês custo atual do processo
  costReductionPct: number      // % de redução esperada
  peopleImpacted: number        // pessoas beneficiadas
  hoursSavedPerPerson: number   // horas economizadas/pessoa/mês
  hourlyRate: number            // custo/hora da empresa (do roi_config)
}

export interface RoiProjection {
  monthlySavings: number
  annualSavings: number
  devCost: number
  roiPct: number
  paybackMonths: number | null
  netBenefit: number
}

export function calcMonthlySavings(inputs: RoiInputs): number {
  const processSavings = inputs.currentProcessCost * (inputs.costReductionPct / 100)
  const timeSavings = inputs.peopleImpacted * inputs.hoursSavedPerPerson * inputs.hourlyRate
  return processSavings + timeSavings
}

export function calcProjectRoi(
  monthlySavings: number,
  estimatedHours: number,
  hourlyRate: number,
  overheadMultiplier: number,
): RoiProjection {
  const devCost = estimatedHours * hourlyRate * overheadMultiplier
  const annualSavings = monthlySavings * 12
  const netBenefit = annualSavings - devCost
  const roiPct = devCost > 0 ? (netBenefit / devCost) * 100 : 0
  const paybackMonths = monthlySavings > 0 ? devCost / monthlySavings : null

  return {
    monthlySavings,
    annualSavings,
    devCost,
    roiPct: Math.round(roiPct),
    paybackMonths: paybackMonths != null ? Math.round(paybackMonths * 10) / 10 : null,
    netBenefit,
  }
}
