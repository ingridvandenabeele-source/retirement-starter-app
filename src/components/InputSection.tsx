import React from 'react';
import { UserInputs } from '../types';

interface InputSectionProps {
  inputs: UserInputs;
  onChange: (field: keyof UserInputs, value: number) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ inputs, onChange }) => {
  
  const handleChange = (field: keyof UserInputs, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChange(field, isNaN(val) ? 0 : val);
  };

  const InputField = ({ 
    label, 
    field, 
    unit, 
    step = 1,
    min = 0
  }: { 
    label: string, 
    field: keyof UserInputs, 
    unit?: string,
    step?: number,
    min?: number
  }) => (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type="number"
          min={min}
          step={step}
          value={inputs[field].toString()} 
          onChange={(e) => handleChange(field, e)}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-3 pr-12 py-2 
                     focus:border-[#2E3A59] dark:focus:border-blue-500 focus:ring-[#2E3A59] dark:focus:ring-blue-500 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                     border sm:text-sm transition-colors"
        />
        {unit && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{unit}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-6 text-[#2E3A59] dark:text-blue-100 transition-colors">
        Your Plan Inputs
      </h2>
      
      <div className="space-y-2">
        <InputField label="Start Amount" field="startAmount" unit="€" step={1000} />
        <InputField label="Monthly Contribution" field="monthlyContribution" unit="€" step={50} />
        
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Expected Annual Return" field="annualReturn" unit="%" step={0.1} />
          <InputField label="Annual Inflation" field="annualInflation" unit="%" step={0.1} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Current Age" field="currentAge" unit="y" />
          <InputField label="Planned Retirement Age" field="retirementAge" unit="y" />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
           <div className="mb-6">
             <InputField 
               label="Desired Extra Income (Today's Value)" 
               field="desiredExtraIncome" 
               unit="€/yr" 
               step={1000}
             />
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-[-15px]">
               The extra yearly income you want on top of your state pension, in today's euros.
             </p>
           </div>
           
           <div>
             <InputField 
               label="Safety Buffer" 
               field="bufferPercentage" 
               unit="%" 
               step={5}
             />
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-[-15px]">
               Optional: Add a percentage margin for unexpected costs (e.g. 10% or 20%).
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};