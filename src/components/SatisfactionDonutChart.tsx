import React, { useState } from 'react';
import { LIKERT_LABELS } from '../utils/analytics';
import { StatMetrics } from '../types/survey';

interface SatisfactionDonutChartProps {
  distribution: Record<number, number>; // 1~5
  percentages: Record<number, number>;
  stats: StatMetrics;
  size?: number;
}

export const SatisfactionDonutChart: React.FC<SatisfactionDonutChartProps> = ({
  distribution,
  percentages,
  stats,
  size = 220
}) => {
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);

  const colors: Record<number, string> = {
    5: '#10b981', // emerald-500 매우 만족
    4: '#6366f1', // indigo-500 만족
    3: '#94a3b8', // slate-400 보통
    2: '#f59e0b', // amber-500 불만족
    1: '#f43f5e'  // rose-500 매우 불만족
  };

  const total = Object.values(distribution).reduce((a, b) => a + b, 0);

  // SVG Donut calculation
  const radius = 80;
  const strokeWidth = 28;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray and strokeDashoffset for each slice
  // Order: 5, 4, 3, 2, 1
  let cumulativePercent = 0;
  const slices = [5, 4, 3, 2, 1].map(score => {
    const count = distribution[score] || 0;
    const pct = total > 0 ? (count / total) * 100 : 0;
    const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += pct;

    return {
      score,
      label: LIKERT_LABELS[score],
      count,
      pct: percentages[score] || Number(pct.toFixed(1)),
      color: colors[score],
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      {/* SVG Donut */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {slices.map(slice => {
            if (slice.count === 0) return null;
            const isHovered = hoveredScore === slice.score;
            return (
              <circle
                key={slice.score}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredScore(slice.score)}
                onMouseLeave={() => setHoveredScore(null)}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {hoveredScore ? (
            <div className="animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[11px] font-semibold text-slate-500 block">
                {LIKERT_LABELS[hoveredScore]} ({hoveredScore}점)
              </span>
              <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                {percentages[hoveredScore]}%
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {distribution[hoveredScore]}명
              </span>
            </div>
          ) : (
            <div>
              <span className="text-[10px] font-bold text-indigo-600 block uppercase tracking-wider">
                전체 만족도 평균
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 leading-tight">
                {stats.mean.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                5.00점 만점
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Legend & Statistics Summary */}
      <div className="space-y-2.5 w-full max-w-xs text-xs">
        <div className="space-y-1.5 pb-2 border-b border-slate-100">
          {slices.map(s => {
            const isHovered = hoveredScore === s.score;
            return (
              <div
                key={s.score}
                onMouseEnter={() => setHoveredScore(s.score)}
                onMouseLeave={() => setHoveredScore(null)}
                className={`flex items-center justify-between p-1.5 rounded-md cursor-pointer transition-colors ${
                  isHovered ? 'bg-slate-100/80 font-medium' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-slate-700">
                    {s.score}점 · {s.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums text-slate-500">
                  <span className="font-semibold text-slate-800">{s.pct}%</span>
                  <span className="text-[11px] text-slate-400">({s.count}명)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistical Summary Box: Mean, Median, Mode */}
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1 text-[11px]">
          <div className="flex justify-between items-center text-slate-600">
            <span>평균 (Mean)</span>
            <span className="font-mono font-bold text-indigo-700">{stats.mean}점</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>중앙값 (Median)</span>
            <span className="font-mono font-bold text-slate-800">{stats.median}점</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>최빈값 (Mode)</span>
            <span className="font-mono font-bold text-slate-800">{stats.modeLabel}</span>
          </div>
          {stats.standardDeviation !== undefined && (
            <div className="flex justify-between items-center text-slate-400 text-[10px] pt-0.5 border-t border-slate-200/60">
              <span>표준편차</span>
              <span className="font-mono">±{stats.standardDeviation}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
