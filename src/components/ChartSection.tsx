import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { YearData } from '../types';
import { formatCurrency } from '../services/financeService';

interface ChartSectionProps {
  data: YearData[];
  isDarkMode: boolean;
}

// Compact formatter for axis labels (e.g. €1.2M, €500k)
const formatCompactEUR = (value: number) => {
  if (value === 0) return '€0';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `€${(value / 1_000).toFixed(0)}k`;
  return `€${value.toFixed(0)}`;
};

export const ChartSection: React.FC<ChartSectionProps> = ({ data, isDarkMode }) => {
  const colors = {
    nominal: isDarkMode ? '#60A5FA' : '#2E3A59', // Blue-400 (Dark) vs Brand Dark Blue (Light)
    real: isDarkMode ? '#FBBF24' : '#C9A227',    // Amber-400 (Dark) vs Brand Gold (Light)
    grid: isDarkMode ? '#374151' : '#E5E7EB',    // Gray-700 vs Gray-200
    text: isDarkMode ? '#9CA3AF' : '#6B7280',    // Gray-400 vs Gray-500
    tooltipBg: isDarkMode ? '#1F2937' : '#FFFFFF',
    tooltipBorder: isDarkMode ? '#374151' : '#E5E7EB',
    tooltipText: isDarkMode ? '#F3F4F6' : '#111827',
  };

  // Custom tooltip to include Age and properly formatted values
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Access the full data object for this point to get the Age
      const currentData = payload[0].payload as YearData;
      
      return (
        <div 
          className="p-3 border rounded-lg shadow-lg text-sm"
          style={{
            backgroundColor: colors.tooltipBg,
            borderColor: colors.tooltipBorder,
            color: colors.tooltipText,
          }} 
        >
          <p className="font-semibold mb-2">
            Year {label} <span className="font-normal text-xs opacity-75">(Age {currentData.age})</span>
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs opacity-80" style={{ color: colors.tooltipText }}>
                {entry.name}:
              </span>
              <span className="font-medium ml-auto">
                {formatCurrency(entry.value as number)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[#2E3A59] dark:text-gray-100 transition-colors">
          Portfolio Growth
        </h3>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          Inflation adjusted
        </span>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
            <XAxis
              dataKey="yearIndex"
              tick={{ fontSize: 11, fill: colors.text }}
              stroke={colors.text}
              tickLine={false}
              axisLine={{ stroke: colors.grid }}
              label={{ 
                value: 'Years from now', 
                position: 'insideBottomRight', 
                offset: -10, 
                fill: colors.text, 
                fontSize: 11 
              }}
            />
            <YAxis
              tickFormatter={formatCompactEUR}
              tick={{ fontSize: 11, fill: colors.text }}
              stroke={colors.text}
              tickLine={false}
              axisLine={false}
              tickCount={6}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: colors.grid, strokeWidth: 1 }} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }} 
              iconType="circle" 
            />

            <Line
              type="monotone"
              dataKey="nominalBalance"
              name="Nominal"
              stroke={colors.nominal}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="realBalance"
              name="Real (today's euros)"
              stroke={colors.real}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic text-center transition-colors">
        The blue line shows projected value; the gold line shows purchasing power in today's money.
      </p>
    </div>
  );
};