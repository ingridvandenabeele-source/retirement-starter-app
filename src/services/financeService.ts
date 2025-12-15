import { UserInputs, CalculationResults, YearData } from '../types';

export const calculateRetirementData = (inputs: UserInputs): CalculationResults => {
  const {
    startAmount,
    monthlyContribution,
    annualReturn,
    annualInflation,
    currentAge,
    retirementAge,
    desiredExtraIncome,
    bufferPercentage = 0,
  } = inputs;

  // Basic derivation
  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);
  
  // Rate conversions (percentage to decimal)
  const r = annualReturn / 100;
  const i = annualInflation / 100;

  let currentNominal = startAmount;
  let currentCPI = 1;
  
  const chartData: YearData[] = [];

  // Initial State (Year 0)
  chartData.push({
    yearIndex: 0,
    age: currentAge,
    nominalBalance: currentNominal,
    realBalance: currentNominal / currentCPI, // P0 / 1
  });

  // 4.1 Year-by-year projection
  for (let t = 1; t <= yearsUntilRetirement; t++) {
    // Nominal_Balance[t] = (Nominal_Balance[t-1] + C * 12) * (1 + r)
    // Note: Contributions are added throughout the year, then growth is applied. 
    // This is a simplified compounding model often used in these basic sheets.
    currentNominal = (currentNominal + (monthlyContribution * 12)) * (1 + r);
    
    // CPI_Index[t] = CPI_Index[t-1] * (1 + i)
    currentCPI = currentCPI * (1 + i);
    
    // Real_Balance[t] = Nominal_Balance[t] / CPI_Index[t]
    const realBalance = currentNominal / currentCPI;

    chartData.push({
      yearIndex: t,
      age: currentAge + t,
      nominalBalance: currentNominal,
      realBalance: realBalance,
    });
  }

  // 4.2 Key outputs at retirement (year N)
  const finalYearData = chartData[chartData.length - 1];
  const nominalFinal = finalYearData.nominalBalance;
  const realFinal = finalYearData.realBalance;

  // 4.3 Required income and years covered
  // Apply safety buffer to the desired income first
  const bufferedDesiredIncome = desiredExtraIncome * (1 + bufferPercentage / 100);

  // Required_Income_Retirement = buffered_income * (1 + i)^N
  const requiredIncomeRetirement = bufferedDesiredIncome * Math.pow(1 + i, yearsUntilRetirement);

  // Increase vs today (%)
  // We compare the final required nominal income vs the raw desired income today (without buffer)
  // to show the total multiplier needed (Inflation + Buffer).
  // Increase_vs_today = Required_Income_Retirement / extra_income_today - 1
  const increaseVsToday = desiredExtraIncome > 0 
    ? (requiredIncomeRetirement / desiredExtraIncome) - 1 
    : 0;

  // Years of spending covered at retirement
  // This now accounts for the buffer because it divides by requiredIncomeRetirement
  const yearsCovered = requiredIncomeRetirement > 0 
    ? nominalFinal / requiredIncomeRetirement 
    : 0;

  return {
    nominalFinal,
    realFinal,
    requiredIncomeRetirement,
    increaseVsToday,
    yearsCovered,
    chartData,
  };
};

// Formatter helper
export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatNumber = (val: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('en-EU', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(val);
};