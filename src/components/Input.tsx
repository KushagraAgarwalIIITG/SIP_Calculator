import React from 'react';

interface InputProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  type?: 'number' | 'text';
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function Input({
  label,
  value,
  onChange,
  type = 'number',
  min,
  max,
  step,
  prefix,
  suffix,
  className = ''
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(typeof val === 'number' ? val : 0);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            prefix ? 'pl-8' : ''
          } ${suffix ? 'pr-12' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
