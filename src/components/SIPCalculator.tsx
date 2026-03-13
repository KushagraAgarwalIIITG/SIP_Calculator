import  { useState, useMemo } from 'react';
import { TrendingUp, Wallet, PiggyBank, Target, Calculator, Calendar, Zap } from 'lucide-react';
import { Card, MetricCard } from './Card';
import { Slider } from './Slider';
import { Input } from './Input';
import { Toggle } from './Toggle';
import { MilestoneModal, Milestone } from './MilestoneModal';
import { MilestoneChart } from './MilestoneChart';
import { calculateTax, calculateSIPProjection, formatIndianCurrency } from '../utils/calculations';
import { useSessionStorage } from '../hooks/useSessionStorage';

export function SIPCalculator() {
  const [currentSalary, setCurrentSalary] = useSessionStorage('sip_salary', 1200000);
  const [currentAge, setCurrentAge] = useSessionStorage('sip_age', 28);
  const [sipAmount, setSipAmount] = useSessionStorage('sip_amount', 20000);
  const [currentNetWorth, setCurrentNetWorth] = useSessionStorage('sip_networth', 500000);
  const [roiPercent, setRoiPercent] = useSessionStorage('sip_roi', 12);
  const [years, setYears] = useSessionStorage('sip_years', 25);
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
        plateauLimit,
        inflationRate,
        currentAge,
        currentNetWorth
      ),
    [currentSalary, sipAmount, roiPercent, years, plateauLimit, inflationRate, currentAge, currentNetWorth]
  );

  const finalProjection = projections[projections.length - 1];
  const savingsRate = (sipAmount * 12 / currentTaxCalc.postTaxSalary) * 100;

  const chartData = projections.map((p) => ({
    year: p.year,
    age: p.age,
    'SIP Corpus': Math.round(p.sipNominalValue),
    'Net Worth': Math.round(p.netWorthNominal),
    'Total Wealth': Math.round(p.totalNominalValue),
    'Total Wealth (Real)': Math.round(p.totalRealValue),
    'Total Invested': Math.round(p.cumulativeInvestment)
  }));

  const maxAge = currentAge + years;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Career SIP & Tax Planner
          </h1>
          <p className="text-gray-600">
            Plan your financial future with realistic salary growth and tax calculations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card title="Personal Details">
              <div className="space-y-6">
                <Input
                  label="Current Age"
                  value={currentAge}
                  onChange={setCurrentAge}
                  min={18}
                  max={65}
                  step={1}
                  suffix="years"
                />
                <Slider
                  label="Pre-Tax Annual Salary"
                  value={currentSalary}
                  onChange={setCurrentSalary}
                  min={300000}
                  max={10000000}
                  step={100000}
                  formatValue={formatIndianCurrency}
                />
              </div>
            </Card>

            <Card title="Current Tax Summary">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label="Monthly Post-Tax"
                  value={formatIndianCurrency(currentTaxCalc.monthlyPostTax)}
                  icon={<Wallet size={20} />}
                />
                <MetricCard
                  label="Effective Tax Rate"
                  value={`${currentTaxCalc.effectiveTaxRate.toFixed(1)}%`}
                  icon={<Calculator size={20} />}
                />
                <MetricCard
                  label="Annual Tax"
                  value={formatIndianCurrency(currentTaxCalc.totalTax)}
                />
                <MetricCard
                  label="Post-Tax Annual"
                  value={formatIndianCurrency(currentTaxCalc.postTaxSalary)}
                />
              </div>
            </Card>

            <Card title="SIP & Current Net Worth">
              <div className="space-y-6">
                <Slider
                  label="Monthly SIP Amount"
                  value={sipAmount}
                  onChange={setSipAmount}
                  min={5000}
                  max={200000}
                  step={5000}
                  formatValue={formatIndianCurrency}
                />
                <Slider
                  label="Current Net Worth"
                  value={currentNetWorth}
                  onChange={setCurrentNetWorth}
                  min={0}
                  max={10000000}
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
                  label="Salary Plateau Limit"
                  value={plateauLimit}
                  onChange={setPlateauLimit}
                  min={1000000}
                  max={20000000}
                  step={500000}
                  formatValue={formatIndianCurrency}
                />
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600">
                    SIP steps up 10% annually until salary reaches this limit, then stays flat
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Inflation Adjustment">
              <div className="space-y-4">
                <Toggle
                  label="Adjust for Inflation"
                  checked={showInflationAdjusted}
                  onChange={setShowInflationAdjusted}
                  description="Show purchasing power in today's money"
                />
                {showInflationAdjusted && (
                  <Slider
                    label="Expected Inflation Rate"
                    value={inflationRate}
                    onChange={setInflationRate}
                    min={3}
                    max={10}
                    step={0.5}
                    suffix="%"
                  />
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title={`Projected Wealth at Age ${finalProjection.age}`}>
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
                  subValue={`From ₹${(sipAmount).toLocaleString('en-IN')}/mo`}
                  icon={<PiggyBank size={20} />}
                />
                <MetricCard
                  label="Compounded Net Worth"
                  value={formatIndianCurrency(finalProjection.netWorthNominal)}
                  subValue={`From ₹${formatIndianCurrency(currentNetWorth)}`}
                  icon={<Wallet size={20} />}
                />
                <MetricCard
                  label="Total Invested"
                  value={formatIndianCurrency(finalProjection.cumulativeInvestment)}
                  subValue={`Over ${years} years`}
                  icon={<Calendar size={20} />}
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
                      icon={<Calculator size={20} />}
                    />
                  </>
                )}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-800 mb-1 font-medium">Total Wealth Gain</p>
                <p className="text-3xl font-bold text-green-900">
                  {formatIndianCurrency(finalProjection.totalNominalValue - currentNetWorth - finalProjection.cumulativeInvestment)}
                </p>
                <p className="text-xs text-green-700 mt-2">
                  Initial Net Worth: {formatIndianCurrency(currentNetWorth)} • SIP Invested: {formatIndianCurrency(finalProjection.cumulativeInvestment)}
                </p>
              </div>
            </Card>

            <Card title="Growth Projection">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowMilestoneModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
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
                    {milestones.map((m) => (
                      <div
                        key={m.id}
                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: m.color }}
                      >
                        {m.label} ({m.age})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card title="Age-by-Age Breakdown" className="max-h-96 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Age</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600">Monthly SIP</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600">SIP Corpus</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600">Net Worth</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-gray-600">Total Wealth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projections.filter((_, i) => i % 5 === 0 || i === projections.length - 1).map((p) => (
                    <tr key={p.year} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-gray-900 font-medium">{p.age}</td>
                      <td className="px-2 py-2 text-right text-gray-700 text-xs">
                        {formatIndianCurrency(p.sipAmount)}
                      </td>
                      <td className="px-2 py-2 text-right text-blue-600 font-semibold text-xs">
                        {formatIndianCurrency(p.sipNominalValue)}
                      </td>
                      <td className="px-2 py-2 text-right text-amber-600 font-semibold text-xs">
                        {formatIndianCurrency(p.netWorthNominal)}
                      </td>
                      <td className="px-2 py-2 text-right text-green-600 font-bold text-xs">
                        {formatIndianCurrency(p.totalNominalValue)}
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
