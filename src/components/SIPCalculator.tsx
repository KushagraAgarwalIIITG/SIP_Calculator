import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  Target,
  Zap,
  Percent,
  ReceiptIndianRupee,
  IndianRupee,
  HandCoins,
  CalendarDays
} from 'lucide-react';
import { Card, MetricCard } from './Card';
import { Slider } from './Slider';
import { Input } from './Input';
import { Toggle } from './Toggle';
import { MilestoneModal, Milestone } from './MilestoneModal';
import { MilestoneChart } from './MilestoneChart';
import { calculateTax, calculateSIPProjection, formatIndianCurrency } from '../utils/calculations';
import { useSessionStorage } from '../hooks/useSessionStorage';

interface MilestoneSnapshot {
  year: number;
  age: number;
  'SIP Corpus': number;
  'Net Worth': number;
  'Total Wealth': number;
  'Total Wealth (Real)': number;
  'Total Invested': number;
}

interface SIPCalculatorProps {
  onNavigate?: (path: string) => void;
}

export function SIPCalculator({ onNavigate }: SIPCalculatorProps) {
  const [currentSalary, setCurrentSalary] = useSessionStorage('sip_salary', 1500000);
  const [currentAge, setCurrentAge] = useSessionStorage('sip_age', 26);
  const [sipAmount, setSipAmount] = useSessionStorage('sip_amount', 50000);
  const [currentNetWorth, setCurrentNetWorth] = useSessionStorage('sip_networth', 500000);
  const [roiPercent, setRoiPercent] = useSessionStorage('sip_roi', 12);
  const [years, setYears] = useSessionStorage('sip_years', 25);
  const [annualStepUpPercent, setAnnualStepUpPercent] = useSessionStorage('sip_step_up', 7);
  const [plateauLimit, setPlateauLimit] = useSessionStorage('sip_plateau', 7000000);
  const [inflationRate, setInflationRate] = useSessionStorage('sip_inflation', 6);
  const [showInflationAdjusted, setShowInflationAdjusted] = useSessionStorage('sip_show_inflation', true);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestones, setMilestones] = useSessionStorage<Milestone[]>('sip_milestones', []);

  const currentTaxCalc = useMemo(() => calculateTax(currentSalary), [currentSalary]);

  const projections = useMemo(
    () =>
      calculateSIPProjection(
        currentSalary,
        sipAmount,
        roiPercent,
        years,
        annualStepUpPercent,
        plateauLimit,
        inflationRate,
        currentAge,
        currentNetWorth
      ),
    [currentSalary, sipAmount, roiPercent, years, annualStepUpPercent, plateauLimit, inflationRate, currentAge, currentNetWorth]
  );

  const finalProjection = projections[projections.length - 1];
  const savingsRate = (sipAmount * 12 / currentTaxCalc.postTaxSalary) * 100;
  const maxSip = Math.max(...projections.map((p) => p.sipAmount));

  const chartData: MilestoneSnapshot[] = projections.map((p) => ({
    year: p.year,
    age: p.age,
    'SIP Corpus': Math.round(p.sipNominalValue),
    'Net Worth': Math.round(p.netWorthNominal),
    'Total Wealth': Math.round(p.totalNominalValue),
    'Total Wealth (Real)': Math.round(p.totalRealValue),
    'Total Invested': Math.round(p.cumulativeInvestment)
  }));

  const maxAge = currentAge + years;

  const getMilestoneSnapshot = (age: number) => {
    const exactMatch = chartData.find((point) => Number(point.age) === Number(age));
    if (exactMatch) return exactMatch;

    return [...chartData].sort(
      (a, b) => Math.abs(Number(a.age) - Number(age)) - Math.abs(Number(b.age) - Number(age))
    )[0];
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
      return;
    }
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <header className="sticky top-0 z-30 border-b border-emerald-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-600 to-green-500 text-white flex items-center justify-center font-bold">
              PC
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-900 leading-tight">PracticalCalculators</p>
              <p className="text-xs text-emerald-700">Smart tools for practical money decisions</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-emerald-800">
            <button
              type="button"
              onClick={() => navigateTo('/about')}
              className="rounded-lg border border-emerald-300 bg-white px-4 py-2 hover:text-emerald-600 hover:border-emerald-400 transition-colors"
            >
              About
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Practical Step Up SIP Calculator
          </h1>
          <p className="text-gray-600">
            Plan your financial future with realistic salary growth and tax calculations
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card title="1. Personal Salary Inputs">
              <div className="space-y-6">
                <Input
                  label="Current Age"
                  value={currentAge}
                  onChange={setCurrentAge}
                  min={18}
                  max={80}
                  step={1}
                  suffix="years"
                />
                <Slider
                  label="Pre-Tax Annual Salary"
                  value={currentSalary}
                  onChange={setCurrentSalary}
                  min={300000}
                  max={30000000}
                  step={100000}
                  formatValue={formatIndianCurrency}
                />
              </div>
            </Card>

            <Card title="Tax Calculation (Current Salary)">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label="Monthly Post-Tax"
                  value={formatIndianCurrency(currentTaxCalc.monthlyPostTax)}
                  icon={<Wallet size={20} />}
                />
                <MetricCard
                  label="Effective Tax Rate"
                  value={`${currentTaxCalc.effectiveTaxRate.toFixed(1)}%`}
                  icon={<Percent size={20} />}
                />
                <MetricCard
                  label="Annual Tax"
                  value={formatIndianCurrency(currentTaxCalc.totalTax)}
                  icon={<ReceiptIndianRupee size={20} />}
                />
                <MetricCard
                  label="Post-Tax Annual"
                  value={formatIndianCurrency(currentTaxCalc.postTaxSalary)}
                  icon={<IndianRupee size={20} />}
                />
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card title="2. SIP Inputs">
              <div className="space-y-6">
                <Slider
                  label="Monthly SIP Amount"
                  value={sipAmount}
                  onChange={setSipAmount}
                  min={5000}
                  max={3000000}
                  step={5000}
                  formatValue={formatIndianCurrency}
                />
                <Slider
                  label="Current Net Worth"
                  value={currentNetWorth}
                  onChange={setCurrentNetWorth}
                  min={0}
                  max={100000000}
                  step={100000}
                  formatValue={formatIndianCurrency}
                />
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-sm text-blue-800 mb-2">
                    <span className="font-semibold">Monthly SIP:</span> {formatIndianCurrency(sipAmount)}
                  </p>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Savings Rate:</span> {savingsRate.toFixed(1)}% of post-tax salary
                  </p>
                </div>
                <Slider
                  label="Expected Annual ROI"
                  value={roiPercent}
                  onChange={setRoiPercent}
                  min={8}
                  max={18}
                  step={0.5}
                  suffix="%"
                />
                <Slider
                  label="Investment Duration"
                  value={years}
                  onChange={setYears}
                  min={5}
                  max={40}
                  step={1}
                  suffix="years"
                />
                <Slider
                  label="Annual SIP Step-Up"
                  value={annualStepUpPercent}
                  onChange={setAnnualStepUpPercent}
                  min={0}
                  max={25}
                  step={0.5}
                  suffix="%"
                />
                <Slider
                  label="Salary Plateau Limit"
                  value={plateauLimit}
                  onChange={setPlateauLimit}
                  min={1000000}
                  max={30000000}
                  step={500000}
                  formatValue={formatIndianCurrency}
                />
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600">
                    SIP steps up {annualStepUpPercent}% annually until salary reaches this limit, then stays flat.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <Toggle
                    label="Adjust for Inflation"
                    checked={showInflationAdjusted}
                    onChange={setShowInflationAdjusted}
                    description="Show purchasing power in today's money"
                  />
                  {showInflationAdjusted && (
                    <div className="mt-4">
                      <Slider
                        label="Expected Inflation Rate"
                        value={inflationRate}
                        onChange={setInflationRate}
                        min={3}
                        max={10}
                        step={0.5}
                        suffix="%"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card
                title={`Computed Numbers (Age ${finalProjection.age})`}
                className="bg-white border-2 border-emerald-300 shadow-lg ring-1 ring-emerald-100"
              >
                <div className="h-1.5 w-28 rounded-full bg-emerald-500 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
                    <p className="text-sm text-emerald-800 font-medium mb-1">Total Wealth (Real)</p>
                    <p className="text-3xl font-bold text-emerald-900">
                      {formatIndianCurrency(finalProjection.totalRealValue)}
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">@{inflationRate}% inflation-adjusted</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
                    <p className="text-sm text-emerald-800 font-medium mb-1">Total Wealth (Nominal)</p>
                    <p className="text-3xl font-bold text-emerald-900">
                      {formatIndianCurrency(finalProjection.totalNominalValue)}
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">SIP + compounded net worth</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-xs text-green-800 font-medium">Total Invested</p>
                    <p className="text-lg font-semibold text-green-900">
                      {formatIndianCurrency(finalProjection.cumulativeInvestment)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-xs text-green-800 font-medium">Maximum SIP</p>
                    <p className="text-lg font-semibold text-green-900">
                      {formatIndianCurrency(maxSip)}
                    </p>
                  </div>
                </div>

                <div className="hidden">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <MetricCard
                      label="Total Wealth (Nominal)"
                      value={formatIndianCurrency(finalProjection.totalNominalValue)}
                      subValue="SIP + Net Worth"
                      icon={<Target size={20} />}
                    />
                    <MetricCard
                      label="SIP Corpus"
                      value={formatIndianCurrency(finalProjection.sipNominalValue)}
                      subValue={`From ${formatIndianCurrency(sipAmount)}/mo`}
                      icon={<PiggyBank size={20} />}
                    />
                    <MetricCard
                      label="Compounded Net Worth"
                      value={formatIndianCurrency(finalProjection.netWorthNominal)}
                      subValue={`From ${formatIndianCurrency(currentNetWorth)}`}
                      icon={<Wallet size={20} />}
                    />
                    <MetricCard
                      label="Total Invested"
                      value={formatIndianCurrency(finalProjection.cumulativeInvestment)}
                      subValue={`Over ${years} years`}
                      icon={<HandCoins size={20} />}
                    />
                    {showInflationAdjusted && (
                      <>
                        <MetricCard
                          label="Total Wealth (Real)"
                          value={formatIndianCurrency(finalProjection.totalRealValue)}
                          subValue={`@${inflationRate}% inflation`}
                          icon={<TrendingUp size={20} />}
                        />
                        <MetricCard
                          label="Final Monthly SIP"
                          value={formatIndianCurrency(finalProjection.sipAmount)}
                          subValue="After step-ups"
                          icon={<CalendarDays size={20} />}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="hidden bg-white/80 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-800 mb-1 font-medium">Total Wealth Gain</p>
                  <p className="text-3xl font-bold text-green-900">
                    {formatIndianCurrency(finalProjection.totalNominalValue - currentNetWorth - finalProjection.cumulativeInvestment)}
                  </p>
                  <p className="text-xs text-green-700 mt-2">
                    Initial Net Worth: {formatIndianCurrency(currentNetWorth)} | SIP Invested: {formatIndianCurrency(finalProjection.cumulativeInvestment)}
                  </p>
                </div>
              </Card>

              <Card title="3. Growth Projection">
                <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowMilestoneModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 hover:shadow-lg transition-colors font-medium"
                >
                  <Zap size={18} />
                  Add Life Milestones
                </button>
                </div>
                <MilestoneChart
                  data={chartData}
                  milestones={milestones}
                  showInflationAdjusted={showInflationAdjusted}
                  minAge={currentAge}
                  maxAge={maxAge}
                />
                {milestones.length > 0 && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-800 font-medium mb-2">Milestones Added: {milestones.length}</p>
                    <div className="flex flex-wrap gap-2">
                      {milestones.map((m) => {
                        const snapshot = getMilestoneSnapshot(m.age);

                        return (
                          <div key={m.id} className="relative group flex items-center">
                            <button
                              type="button"
                              className="px-3 py-1 rounded-l-full text-xs font-medium text-white hover:brightness-95 transition"
                              style={{ backgroundColor: m.color }}
                            >
                              {m.label} ({m.age})
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete milestone ${m.label}`}
                              onClick={() => handleDeleteMilestone(m.id)}
                              className="px-2 py-1 rounded-r-full text-xs font-bold text-white/95 hover:text-white hover:brightness-90 transition"
                              style={{ backgroundColor: m.color }}
                            >
                              x
                            </button>

                            {snapshot && (
                              <div className="pointer-events-none absolute left-1/2 z-20 mt-2 w-72 -translate-x-1/2 rounded-lg border border-purple-200 bg-white p-3 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                                <p className="text-xs text-purple-700 font-medium mb-1">
                                  {m.label} (Age {m.age})
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <p className="text-gray-700">
                                    Invested: {formatIndianCurrency(snapshot['Total Invested'])}
                                  </p>
                                  <p className="text-blue-700">
                                    SIP: {formatIndianCurrency(snapshot['SIP Corpus'])}
                                  </p>
                                  <p className="text-amber-700">
                                    Net Worth: {formatIndianCurrency(snapshot['Net Worth'])}
                                  </p>
                                  <p className="text-green-700">
                                    Wealth: {formatIndianCurrency(snapshot['Total Wealth'])}
                                  </p>
                                  {showInflationAdjusted && (
                                    <p className="text-purple-700 col-span-2">
                                      Wealth (Real): {formatIndianCurrency(snapshot['Total Wealth (Real)'])}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card title="Age-by-Age Breakdown" className="w-full max-h-[42rem] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Age</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600">Pre-Tax Salary</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600">Post-Tax Salary</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600">Monthly SIP</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600">Nominal Corpus</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600">Real Corpus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projections.filter((_, i) => i % 5 === 0 || i === projections.length - 1).map((p) => (
                    <tr key={p.year} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-gray-900 font-medium">{p.age}</td>
                      <td className="px-2 py-2 text-right text-gray-700 text-xs">
                        {formatIndianCurrency(p.preTaxSalary)}
                      </td>
                      <td className="px-2 py-2 text-right text-gray-700 text-xs">
                        {formatIndianCurrency(p.postTaxSalary)}
                      </td>
                      <td className="px-2 py-2 text-right text-gray-700 text-xs">
                        {formatIndianCurrency(p.sipAmount)}
                      </td>
                      <td className="px-2 py-2 text-right text-amber-600 font-semibold text-xs">
                        {formatIndianCurrency(p.totalNominalValue)}
                      </td>
                      <td className="px-2 py-2 text-right text-purple-600 font-semibold text-xs">
                        {formatIndianCurrency(p.totalRealValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>

        <MilestoneModal
          isOpen={showMilestoneModal}
          onClose={() => setShowMilestoneModal(false)}
          milestones={milestones}
          onMilestonesChange={setMilestones}
          minAge={currentAge}
          maxAge={maxAge}
        />
      </div>
    </div>
  );
}
