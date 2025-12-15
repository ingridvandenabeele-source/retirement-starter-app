import React, { useState, useMemo, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { ChartSection } from './components/ChartSection';
import { calculateRetirementData } from './services/financeService';
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               {/* Simple Logo Icon */}
               <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2E3A59] dark:bg-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
               </div>
               <h1 className="text-xl md:text-2xl font-bold text-[#2E3A59] dark:text-gray-100 transition-colors">
                 Retirement Starter
               </h1>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
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
                    <strong className="text-gray-900 dark:text-white">Years of extra lifestyle covered</strong> – This estimates how many years that extra lifestyle could be funded by your portfolio. It is not a full retirement plan, just a simple illustration.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-gray-700">
                <p className="text-xs text-slate-600 dark:text-gray-400">
                  <strong>Note:</strong> Even if your portfolio grows, your future lifestyle gets more expensive. Sometimes your yearly cost grows faster than your investments, so the years of coverage can go down when you wait longer.
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