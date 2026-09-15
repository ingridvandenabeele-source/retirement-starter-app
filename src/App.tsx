import React, { useState, useMemo, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { ChartSection } from './components/ChartSection';
import { calculateRetirementData, formatCurrency, formatNumber } from './services/financeService';
import { UserInputs } from './types';
import { DEFAULT_INPUTS, COLORS } from './constants';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_INPUTS);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode Class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleInputChange = (field: keyof UserInputs, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Recalculate whenever inputs change
  const results = useMemo(() => calculateRetirementData(inputs), [inputs]);

  return (
    <div className="min-h-screen pb-12 transition-colors duration-300 bg-[#F5F5FA] dark:bg-gray-900">
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
               {/* Simple Logo Icon */}
               <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2E3A59] dark:bg-blue-600 transition-colors shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
               </div>
               <div>
                 <h1 className="text-xl md:text-2xl font-bold text-[#2E3A59] dark:text-gray-100 transition-colors">
                   Retirement Starter
                 </h1>
                 <p className="mt-1 text-base md:text-lg font-medium text-[#2E3A59] dark:text-gray-200">
                   Will your investments be enough to provide the extra retirement income you want?
                 </p>
                 <p className="mt-0.5 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                   See how investment growth, inflation and your retirement age could affect your future income.
                 </p>
               </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 shrink-0"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                // Sun Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                // Moon Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <InputSection inputs={inputs} onChange={handleInputChange} />
          </div>

          {/* Right Column: Results & Chart */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Results Grid */}
            <ResultsSection results={results} />

            {/* Your Retirement Snapshot */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-base font-semibold text-[#2E3A59] dark:text-blue-100 mb-2">
                Your Retirement Snapshot
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 leading-relaxed">
                <p>
                  At age <strong className="text-gray-900 dark:text-white font-semibold">{inputs.retirementAge}</strong>, your projected portfolio is approximately <strong className="text-gray-900 dark:text-white font-semibold">{formatCurrency(results.realFinal)}</strong> in today’s money.
                </p>
                <p>
                  Your target is <strong className="text-gray-900 dark:text-white font-semibold">{formatCurrency(results.requiredIncomeRetirement)}</strong> per year of extra retirement income.
                </p>
                <p>
                  This projected portfolio represents approximately <strong className="text-[#C9A227] dark:text-[#FBBF24] font-semibold">{formatNumber(results.yearsCovered, 1)}×</strong> your target annual extra income at retirement.
                </p>
              </div>
            </div>

            {/* How this calculator works (Expandable) */}
            <details className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 overflow-hidden">
              <summary className="p-4 flex items-center justify-between cursor-pointer list-none select-none text-sm font-medium text-[#2E3A59] dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-750 transition-colors">
                <span>How this calculator works</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4 pt-1 border-t border-gray-50 dark:border-gray-700/60 text-sm text-gray-600 dark:text-gray-300 space-y-2.5 leading-relaxed">
                <p>
                  This calculator provides an illustrative projection based on the assumptions you enter.
                </p>
                <p>
                  Your existing portfolio is projected forward using your expected annual return. Monthly contributions are simplified into one annual contribution and added at the end of each year.
                </p>
                <p>
                  Inflation is used to show what your projected portfolio could be worth in today’s purchasing power.
                </p>
                <p>
                  Actual investment returns and inflation will vary, so these results are estimates rather than predictions.
                </p>
              </div>
            </details>

            {/* Explanation Block */}
            <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700 transition-colors duration-300">
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-[#2E3A59] dark:text-blue-300 transition-colors">
                What do these numbers mean?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
                <div className="space-y-3">
                  <p>
                    <strong className="text-gray-900 dark:text-white">Nominal portfolio at retirement</strong> – This is the amount you might see on your account statement in the future.
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">Real portfolio at retirement</strong> – This shows what that money is worth in today’s euros, after inflation eats away purchasing power.
                  </p>
                </div>
                <div className="space-y-3">
                  <p>
                    <strong className="text-gray-900 dark:text-white">Required extra income</strong> – This is how much extra money you would need per year in retirement to match your desired lifestyle, adjusted for inflation.
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">Portfolio / annual income need</strong> – How many years of your target extra income your projected portfolio represents at retirement. This is a simple ratio and does not model investment returns or withdrawals after retirement.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-gray-700">
                <p className="text-xs text-slate-600 dark:text-gray-400">
                  <strong>Note:</strong> Even if your portfolio grows, your future lifestyle gets more expensive. Sometimes your yearly cost grows faster than your investments, so the ratio can go down when you wait longer.
                </p>
              </div>
            </div>

            {/* Chart */}
            <ChartSection data={results.chartData} isDarkMode={isDarkMode} />
            
          </div>
        </div>
      </main>

      {/* Footer / Disclaimer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 max-w-2xl mx-auto">
          Disclaimer: This tool is for educational and illustrative purposes only and does not constitute financial, investment, tax, or legal advice. Please consult a qualified professional for personalised guidance.
        </p>
      </footer>
    </div>
  );
};

export default App;