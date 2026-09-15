import React, { useState, useEffect } from 'react';
import { UserInputs } from '../types';

interface InputSectionProps {
  inputs: UserInputs;
  onChange: (field: keyof UserInputs, value: number) => void;
}

interface InputFieldProps {
  label: string;
  field: keyof UserInputs;
  value: number;
  onChange: (field: keyof UserInputs, value: number) => void;
  unit?: string;
  step?: number;
  min?: number;
  allowDecimals?: boolean;
}

// InputField is defined outside InputSection to prevent component unmounting and focus/cursor loss on re-renders
const InputField: React.FC<InputFieldProps> = ({
  label,
  field,
  value,
  onChange,
  unit,
  step = 1,
  min = 0,
  allowDecimals = true,
}) => {
  // Local string state allows natural text editing (e.g. temporary empty field, typing decimal points)
  const [textValue, setTextValue] = useState<string>(() => (value === 0 ? '0' : value.toString()));
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Synchronize with external numeric changes only when the user is not actively editing
  useEffect(() => {
    if (!isFocused) {
      setTextValue(value.toString());
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const trimmed = textValue.trim();
    if (trimmed === '' || trimmed === '.' || trimmed === ',') {
      setTextValue('0');
      onChange(field, 0);
    } else {
      const normalized = trimmed.replace(',', '.');
      const parsed = parseFloat(normalized);
      if (isNaN(parsed)) {
        setTextValue('0');
        onChange(field, 0);
      } else {
        const finalVal = Math.max(min, parsed);
        setTextValue(finalVal.toString());
        onChange(field, finalVal);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow user to completely clear the field while typing without forcing it back to 0 immediately
    if (raw === '') {
      setTextValue('');
      onChange(field, 0);
      return;
    }

    if (allowDecimals) {
      // Allow digits and at most one decimal separator (dot or comma)
      if (/^[0-9]*[.,]?[0-9]*$/.test(raw)) {
        setTextValue(raw);
        const normalized = raw.replace(',', '.');
        if (normalized === '.' || normalized === '') {
          onChange(field, 0);
        } else {
          const parsed = parseFloat(normalized);
          if (!isNaN(parsed)) {
            onChange(field, parsed);
          }
        }
      }
    } else {
      // Allow only integer digits for age fields
      if (/^[0-9]*$/.test(raw)) {
        setTextValue(raw);
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed)) {
          onChange(field, parsed);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const current = parseFloat(textValue.replace(',', '.')) || 0;
      const direction = e.key === 'ArrowUp' ? 1 : -1;
      const stepDecimals = step.toString().includes('.') ? step.toString().split('.')[1].length : 0;
      const nextVal = Math.max(
        min,
        parseFloat((current + direction * step).toFixed(Math.max(stepDecimals, 2)))
      );
      setTextValue(nextVal.toString());
      onChange(field, nextVal);
    }
  };

  const inputId = `input-${field}`;

  return (
    <div className="mb-5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors"
      >
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          id={inputId}
          type="text"
          inputMode={allowDecimals ? 'decimal' : 'numeric'}
          value={textValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
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
};

export const InputSection: React.FC<InputSectionProps> = ({ inputs, onChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-6 text-[#2E3A59] dark:text-blue-100 transition-colors">
        Your Plan Inputs
      </h2>
      
      <div className="space-y-2">
        <InputField 
          label="Start Amount" 
          field="startAmount" 
          value={inputs.startAmount} 
          onChange={onChange} 
          unit="€" 
          step={1000} 
        />
        <InputField 
          label="Monthly Contribution" 
          field="monthlyContribution" 
          value={inputs.monthlyContribution} 
          onChange={onChange} 
          unit="€" 
          step={50} 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <InputField 
            label="Expected Annual Return" 
            field="annualReturn" 
            value={inputs.annualReturn} 
            onChange={onChange} 
            unit="%" 
            step={0.1} 
            allowDecimals={true}
          />
          <InputField 
            label="Annual Inflation" 
            field="annualInflation" 
            value={inputs.annualInflation} 
            onChange={onChange} 
            unit="%" 
            step={0.1} 
            allowDecimals={true}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField 
            label="Current Age" 
            field="currentAge" 
            value={inputs.currentAge} 
            onChange={onChange} 
            unit="y" 
            step={1}
            allowDecimals={false}
          />
          <InputField 
            label="Planned Retirement Age" 
            field="retirementAge" 
            value={inputs.retirementAge} 
            onChange={onChange} 
            unit="y" 
            step={1}
            allowDecimals={false}
          />
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
           <div className="mb-6">
             <InputField 
               label="Desired Extra Income (Today's Value)" 
               field="desiredExtraIncome" 
               value={inputs.desiredExtraIncome} 
               onChange={onChange} 
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
               value={inputs.bufferPercentage} 
               onChange={onChange} 
               unit="%" 
               step={5} 
               allowDecimals={true}
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