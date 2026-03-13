import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-white/85 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgba(16,185,129,0.10)] border border-emerald-100 p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">{title}</h3>}
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
    <div className="bg-gradient-to-br from-white to-emerald-50/60 rounded-xl p-4 border border-emerald-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1 tracking-tight">{label}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
        {icon && <div className="text-emerald-600">{icon}</div>}
      </div>
    </div>
  );
}
