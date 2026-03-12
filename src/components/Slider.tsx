import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  formatValue?: (value: number) => string;
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  formatValue
}: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const displayValue = formatValue ? formatValue(value) : value.toLocaleString('en-IN');

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-gray-900">
          {displayValue}
          {suffix && <span className="text-gray-600 ml-1">{suffix}</span>}
        </span>
      </div>
      <input
        type="range"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue ? formatValue(min) : min.toLocaleString('en-IN')}</span>
        <span>{formatValue ? formatValue(max) : max.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
