import { UserInputs } from './types';

export const DEFAULT_INPUTS: UserInputs = {
  startAmount: 100000,
  monthlyContribution: 0,
  annualReturn: 6,
  annualInflation: 2,
  currentAge: 50,
  retirementAge: 70,
  desiredExtraIncome: 24000,
  bufferPercentage: 0,
};

export const COLORS = {
  primary: '#2E3A59', // Dark desaturated blue
  accent: '#C9A227',  // Warm gold
  background: '#F5F5FA',
  white: '#FFFFFF',
  textLight: '#6B7280', // Gray-500
};

export const TEXT = {
  currency: '€',
};