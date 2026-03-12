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
  const [maxSipLimit, setMaxSipLimit] = useSessionStorage('sip_max_limit', 100000);
  const [roiPercent, setRoiPercent] = useSessionStorage('sip_roi', 12);
  const [years, setYears] = useSessionStorage('sip_years', 25);
  const [plateauLimit, setPlateauLimit] = useSessionStorage('sip_plateau', 7000000);
  const [inflationRate, setInflationRate] = useSessionStorage('sip_inflation', 6);
  const [showInflationAdjusted, setShowInflationAdjusted] = useSessionStorage('sip_show_inflation', true);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestones, setMilestones] = useSessionStorage<Milestone[]>('sip_milestones', []);

  const currentTaxCalc = useMemo(() => calculateTax(currentSalary), [currentSalary]);

  const effectiveSipAmount = Math.min(sipAmount, maxSipLimit);

  const projections = useMemo(
    () =>
      calculateSIPProjection(
        currentSalary,
        effectiveSipAmount,
        roiPercent,
        years,
        plateauLimit,
        inflationRate,
        currentAge
      ),
    [currentSalary, effectiveSipAmount, roiPercent, years, plateauLimit, inflationRate, currentAge]
  );

  const finalProjection = projections[projections.length - 1];
  const savingsRate = (effectiveSipAmount * 12 / currentTaxCalc.postTaxSalary) * 100;

  const chartData = projections.map((p) => ({
    year: p.year,
    age: p.age,
    'Nominal Value': Math.round(p.nominalValue),
    'Real Value': Math.round(p.realValue),
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

            <Card title="SIP Configuration">
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
                  label="Max SIP Limit"
                  value={maxSipLimit}
                  onChange={setMaxSipLimit}
                  min={5000}
                  max={500000}
                  step={10000}
                  formatValue={formatIndianCurrency}
                />
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-sm text-blue-800 mb-2">
                    <span className="font-semibold">Effective Monthly SIP:</span> {formatIndianCurrency(effectiveSipAmount)}
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
            <Card title="Projected Wealth">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <MetricCard
                  label="Final Corpus (Nominal)"
                  value={formatIndianCurrency(finalProjection.nominalValue)}
                  subValue={`At age ${finalProjection.age}`}
                  icon={<Target size={20} />}
                />
                <MetricCard
                  label="Total Invested"
                  value={formatIndianCurrency(finalProjection.cumulativeInvestment)}
                  subValue={`Over ${years} years`}
                  icon={<PiggyBank size={20} />}
                />
                {showInflationAdjusted && (
                  <>
                    <MetricCard
                      label="Real Value (Today's Money)"
                      value={formatIndianCurrency(finalProjection.realValue)}
                      subValue={`@${inflationRate}% inflation`}
                      icon={<TrendingUp size={20} />}
                    />
                    <MetricCard
                      label="Final Monthly SIP"
                      value={formatIndianCurrency(finalProjection.sipAmount)}
                      subValue="After step-ups"
                      icon={<Calendar size={20} />}
                    />
                  </>
                )}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-800 mb-1 font-medium">Wealth Created</p>
                <p className="text-3xl font-bold text-green-900">
                  {formatIndianCurrency(finalProjection.nominalValue - finalProjection.cumulativeInvestment)}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {((finalProjection.nominalValue / finalProjection.cumulativeInvestment - 1) * 100).toFixed(1)}% return on investment
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

            <Card title="Year-by-Year Breakdown" className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Year</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Age</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Monthly SIP</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Corpus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projections.filter((_, i) => i % 5 === 0 || i === projections.length - 1).map((p) => (
                    <tr key={p.year} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-900">{p.year}</td>
                      <td className="px-3 py-2 text-right text-gray-700">{p.age}</td>
                      <td className="px-3 py-2 text-right text-gray-900 font-medium">
                        {formatIndianCurrency(p.sipAmount)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-900 font-semibold">
                        {formatIndianCurrency(p.nominalValue)}
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
