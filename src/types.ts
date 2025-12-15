export interface UserInputs {
  startAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  annualInflation: number;
  currentAge: number;
  retirementAge: number;
  desiredExtraIncome: number;
  bufferPercentage: number;
}

export interface YearData {
  yearIndex: number;
  age: number;
  nominalBalance: number;
  realBalance: number;
}

export interface CalculationResults {
  nominalFinal: number;
  realFinal: number;
  requiredIncomeRetirement: number;
  increaseVsToday: number;
  yearsCovered: number;
  chartData: YearData[];
}