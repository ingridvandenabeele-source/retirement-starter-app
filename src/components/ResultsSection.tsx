import React from 'react';
import { CalculationResults } from '../types';
import { formatCurrency, formatNumber } from '../services/financeService';
import { COLORS } from '../constants';

interface ResultsSectionProps {
  results: CalculationResults;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      
      {/* Card 1: Nominal Pot */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-600 transition-colors duration-300">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Nominal portfolio at retirement
        </h3>
        <p className="mt-2 text-2xl font-bold text-[#2E3A59] dark:text-blue-100 transition-colors">
          {formatCurrency(results.nominalFinal)}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Future value on statement</p>
      </div>

      {/* Card 2: Real Pot (Hero) */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border-l-4 border-[#C9A227] dark:border-[#FBBF24] transition-colors duration-300">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Real portfolio at retirement
        </h3>
        <p className="mt-2 text-2xl font-bold text-[#2E3A59] dark:text-blue-100 transition-colors">
          {formatCurrency(results.realFinal)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">In today's purchasing power</p>
      </div>

      {/* Card 3: Required Income */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border-l-4 border-gray-200 dark:border-gray-600 transition-colors duration-300">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Required extra income (Future)
        </h3>
        <div className="flex items-baseline gap-2">
          <p className="mt-2 text-2xl font-bold text-[#2E3A59] dark:text-blue-100 transition-colors">
            {formatCurrency(results.requiredIncomeRetirement)}
          </p>
          <span className="text-sm font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">
            +{formatNumber(results.increaseVsToday * 100, 0)}% vs today
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Amount needed to match lifestyle</p>
      </div>

      {/* Card 4: Years Covered */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border-l-4 border-[#C9A227] dark:border-[#FBBF24] transition-colors duration-300">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Years of extra lifestyle covered
        </h3>
        <p className="mt-2 text-3xl font-bold text-[#C9A227] dark:text-[#FBBF24] transition-colors">
          {formatNumber(results.yearsCovered, 1)} years
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Estimate based on capital depletion
        </p>
      </div>

    </div>
  );
};