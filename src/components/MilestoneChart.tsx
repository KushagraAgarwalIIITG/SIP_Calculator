import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  ReferenceDot
} from 'recharts';
import { Milestone } from './MilestoneModal';
import { formatIndianCurrency } from '../utils/calculations';

interface MilestoneChartProps {
  data: any[];
  milestones: Milestone[];
  showInflationAdjusted: boolean;
  minAge: number;
  maxAge: number;
}

export function MilestoneChart({
  data,
  milestones,
  showInflationAdjusted,
  minAge,
  maxAge
}: MilestoneChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">
            Age {payload[0].payload.age}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatIndianCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={data} margin={{ top: 60, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="age"
          label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
          tick={{ fontSize: 12 }}
          type="number"
          domain={[minAge, maxAge]}
        />
        <YAxis
          tickFormatter={(value) => formatIndianCurrency(value)}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} verticalAlign="bottom" height={36} />

        {milestones.map((milestone) => {
          const dataPoint = data.find((d) => d.age === milestone.age);
          if (!dataPoint) return null;

          return (
            <ReferenceLine
              key={`${milestone.id}-ref`}
              x={milestone.age}
              stroke={milestone.color}
              strokeDasharray="3 3"
              opacity={0.4}
            >
              <Label
                value={`${milestone.label} (${milestone.age})`}
                position="top"
                fill={milestone.color}
                fontSize={11}
                fontWeight="600"
                offset={5}
              />
            </ReferenceLine>
          );
        })}

        <Line
          type="monotone"
          dataKey="Total Invested"
          stroke="#94a3b8"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="SIP Corpus"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="Net Worth"
          stroke="#f59e0b"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="Total Wealth"
          stroke="#10b981"
          strokeWidth={3}
          dot={false}
        />
        {showInflationAdjusted && (
          <Line
            type="monotone"
            dataKey="Total Wealth (Real)"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={false}
            strokeDasharray="5 5"
          />
        )}

        {milestones.map((milestone) => {
          const dataPoint = data.find((d) => d.age === milestone.age);
          if (!dataPoint) return null;

          return (
            <ReferenceDot
              key={`${milestone.id}-dot-wealth`}
              x={milestone.age}
              y={dataPoint['Total Wealth']}
              r={6}
              fill={milestone.color}
              stroke="white"
              strokeWidth={2}
            />
          );
        })}

        {showInflationAdjusted &&
          milestones.map((milestone) => {
            const dataPoint = data.find((d) => d.age === milestone.age);
            if (!dataPoint) return null;

            return (
              <ReferenceDot
                key={`${milestone.id}-dot-real`}
                x={milestone.age}
                y={dataPoint['Total Wealth (Real)']}
                r={5}
                fill={milestone.color}
                stroke="white"
                strokeWidth={2}
                opacity={0.7}
              />
            );
          })}
      </LineChart>
    </ResponsiveContainer>
  );
}
