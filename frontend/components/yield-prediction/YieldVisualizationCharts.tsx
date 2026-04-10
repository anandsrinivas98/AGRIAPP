'use client';

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell
} from 'recharts';
import { YieldVisualizationChartsProps } from '@/lib/types/yieldPrediction';

// Round to 2 decimal places to avoid floating point display issues
const round2 = (n: number) => Math.round(n * 100) / 100;

export default function YieldVisualizationCharts({
  prediction,
  analysis,
  comparisons,
}: YieldVisualizationChartsProps) {
  const unit = prediction.unit;
  const estimated = round2(prediction.estimatedYield);
  const [low, high] = prediction.confidenceInterval.map(round2) as [number, number];
  const maxVal = round2(comparisons.potentialMaximum);

  // --- Radar data ---
  const radarData = analysis.keyFactors.map((f) => ({
    factor: f.factor,
    impact: Math.round(f.impact * 100),
  }));

  // --- Bar chart data ---
  const comparisonData = [
    { label: 'Your Yield',     value: estimated,                        fill: '#22c55e' },
    { label: 'Regional Avg',   value: round2(comparisons.regionalAverage),  fill: '#3b82f6' },
    { label: 'Historical Avg', value: round2(comparisons.historicalAverage), fill: '#a855f7' },
    { label: 'Max Potential',  value: maxVal,                           fill: '#f59e0b' },
  ];

  // Safe percentage for confidence bar (avoid divide-by-zero)
  const pct = (v: number) => maxVal > 0 ? Math.min(100, Math.max(0, (v / maxVal) * 100)) : 0;

  return (
    <div className="space-y-8">

      {/* Yield Comparison Bar Chart */}
      <div>
        <h4 className="text-base font-semibold text-gray-700 mb-3">Yield Comparison</h4>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={comparisonData} margin={{ top: 16, right: 16, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            {/* No unit on axis — avoids truncation; shown in tooltip instead */}
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}`}
              width={40}
            />
            <Tooltip
              formatter={(value: number) => [`${value} ${unit}`, 'Yield']}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {comparisonData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
            <ReferenceLine
              y={estimated}
              stroke="#16a34a"
              strokeDasharray="5 3"
              label={{ value: `${estimated} ${unit}`, position: 'insideTopLeft', fontSize: 10, fill: '#16a34a' }}
            />
          </BarChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {comparisonData.map((d) => (
            <div key={d.label} className="flex items-center space-x-1.5 text-xs text-gray-600">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: d.fill }} />
              <span>{d.label}: <strong>{d.value} {unit}</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Factor Impact Radar */}
      <div>
        <h4 className="text-base font-semibold text-gray-700 mb-3">Factor Impact (%)</h4>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData} outerRadius="70%" margin={{ top: 16, right: 32, left: 32, bottom: 16 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fill: '#374151' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} tickCount={4} />
            <Radar
              name="Impact"
              dataKey="impact"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.35}
            />
            <Tooltip formatter={(v: number) => [`${v}%`, 'Impact']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Interval */}
      <div>
        <h4 className="text-base font-semibold text-gray-700 mb-3">Confidence Interval</h4>
        <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden">
          {/* range fill */}
          <div
            className="absolute top-0 h-full bg-green-100 border-x-2 border-green-400"
            style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
          />
          {/* estimated marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-green-600"
            style={{ left: `${pct(estimated)}%` }}
          />
        </div>
        {/* labels below bar */}
        <div className="flex justify-between mt-1.5 text-xs font-medium text-gray-600 px-1">
          <span className="text-gray-500">Low: {low} {unit}</span>
          <span className="text-green-700 font-bold">Est: {estimated} {unit}</span>
          <span className="text-gray-500">High: {high} {unit}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 text-center">
          Green fill = confidence range · Line = estimated yield
        </p>
      </div>

    </div>
  );
}
