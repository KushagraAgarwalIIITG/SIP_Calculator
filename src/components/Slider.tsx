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
        <label className="text-sm font-medium text-gray-700 tracking-tight">{label}</label>
        <span className="text-sm font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
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
        className="w-full h-2.5 bg-emerald-100 rounded-full appearance-none cursor-pointer accent-cyan-500"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue ? formatValue(min) : min.toLocaleString('en-IN')}</span>
        <span>{formatValue ? formatValue(max) : max.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
