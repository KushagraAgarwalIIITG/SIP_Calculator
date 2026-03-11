import React, { useState, useMemo, type ChangeEvent } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Wallet, TrendingUp, PiggyBank, Target, Info } from 'lucide-react';

// --- Types & Interfaces ---

interface YearlyData {
  year: number;
  monthlySIP: number;
  yearlyInvested: number;
  totalInvested: number;
  returns: number;
  corpus: number;
}

interface CalculationSummary {
  totalInvested: number;
  totalReturns: number;
  finalCorpus: number;
  yearHitCap: number | 'Never';
}

// --- Utility Functions ---

const formatINR = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatCompactINR = (value: number): string => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(2)} K`;
  return `₹${value}`;
};

// --- Component ---

export default function App() {
  // State for inputs with explicit number types
  const [currentSalary, setCurrentSalary] = useState<number>(2400000);
  const [startingSIP, setStartingSIP] = useState<number>(40000);
  const [stepUpPct, setStepUpPct] = useState<number>(10);
  const [maxCapSIP, setMaxCapSIP] = useState<number>(150000);
  const [duration, setDuration] = useState<number>(20);
  const [roi, setRoi] = useState<number>(12);

  // Input Handler helper to safely convert strings to numbers
  const handleNumChange = (setter: React.Dispatch<React.SetStateAction<number>>) => 
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setter(isNaN(val) ? 0 : val);
    };

  // Calculate Data
  const { data, summary } = useMemo(() => {
    let corpus = 0;
    let totalInvested = 0;
    let currentSIP = startingSIP;
    const monthlyRate = roi / 100 / 12;
    const years = duration;
    const cap = maxCapSIP;
    const stepUp = stepUpPct / 100;
    
    const yearlyData: YearlyData[] = [];
    let yearHitCap: number | null = null;

    for (let year = 1; year <= years; year++) {
      let yearlyInvested = 0;
      
      for (let month = 1; month <= 12; month++) {
        totalInvested += currentSIP;
        yearlyInvested += currentSIP;
        corpus = (corpus + currentSIP) * (1 + monthlyRate);
      }

      yearlyData.push({
        year,
        monthlySIP: currentSIP,
        yearlyInvested,
        totalInvested: Math.round(totalInvested),
        returns: Math.round(corpus - totalInvested),
        corpus: Math.round(corpus),
      });

      if (yearHitCap === null && currentSIP >= cap) {
        yearHitCap = year;
      }

      const nextSIP = currentSIP * (1 + stepUp);
      currentSIP = Math.min(nextSIP, cap);
    }

    const calculationSummary: CalculationSummary = {
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(corpus - totalInvested),
      finalCorpus: Math.round(corpus),
      yearHitCap: yearHitCap || 'Never',
    };

    return { data: yearlyData, summary: calculationSummary };
  }, [startingSIP, stepUpPct, maxCapSIP, duration, roi]);

  const currentMonthlySalary = currentSalary / 12;
  const currentSIPPercentage = currentMonthlySalary > 0 
    ? ((startingSIP / currentMonthlySalary) * 100).toFixed(1) 
    : "0";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600 h-8 w-8" />
              Capped Step-Up SIP Calculator
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Factoring in salary plateaus and investment caps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                Investment Parameters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Yearly Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                    <input 
                      type="number" 
                      className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentSalary || ''}
                      onChange={handleNumChange(setCurrentSalary)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Starting Monthly SIP</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                    <input 
                      type="number" 
                      className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={startingSIP || ''}
                      onChange={handleNumChange(setStartingSIP)}
                    />
                  </div>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    That's {currentSIPPercentage}% of your current monthly gross.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Annual Step-Up (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full pl-4 pr-8 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={stepUpPct || ''}
                      onChange={handleNumChange(setStepUpPct)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <label className="block text-sm font-semibold text-amber-900 mb-1 flex items-center gap-1">
                    Maximum Monthly SIP Cap
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700">₹</span>
                    <input 
                      type="number" 
                      className="w-full pl-8 pr-4 py-2 border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      value={maxCapSIP || ''}
                      onChange={handleNumChange(setMaxCapSIP)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Years</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={duration || ''}
                      onChange={handleNumChange(setDuration)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expected ROI</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        className="w-full pl-4 pr-8 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={roi || ''}
                        onChange={handleNumChange(setRoi)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results & Visuals Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> Total Invested
                </div>
                <div className="text-2xl font-bold text-slate-900">{formatINR(summary.totalInvested)}</div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Est. Returns
                </div>
                <div className="text-2xl font-bold text-emerald-600">+{formatINR(summary.totalReturns)}</div>
              </div>

              <div className="bg-blue-600 p-6 rounded-2xl shadow-sm border border-blue-700 text-white flex flex-col justify-center">
                <div className="text-blue-200 text-sm font-medium mb-1 flex items-center gap-2">
                  <PiggyBank className="w-4 h-4" /> Final Corpus
                </div>
                <div className="text-2xl md:text-3xl font-bold">{formatINR(summary.finalCorpus)}</div>
              </div>
            </div>

            {/* Plateau Alert */}
            {summary.yearHitCap !== 'Never' && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">The Plateau Effect</h4>
                  <p className="text-sm text-indigo-700 mt-1">
                    You hit your SIP cap of <strong>{formatINR(maxCapSIP)}</strong> in <strong>Year {summary.yearHitCap}</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Wealth Accumulation</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="year" tick={{fontSize: 12}} />
                      <YAxis tickFormatter={formatCompactINR} tick={{fontSize: 12}} width={60} />
                      <Tooltip formatter={(value) => formatINR(Number(value) || 0)} />
                      <Legend verticalAlign="top" height={36}/>
                      <Area type="monotone" dataKey="totalInvested" name="Total Invested" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="returns" name="Wealth Gained" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}