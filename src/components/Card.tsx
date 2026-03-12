import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, subValue, icon }: MetricCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
    </div>
  );
}
