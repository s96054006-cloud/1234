import React from 'react';
import { QuestionStat } from '../types/survey';
import { LIKERT_LABELS } from '../utils/analytics';
import { Award, AlertCircle } from 'lucide-react';

interface QuestionDistributionBarProps {
  questionStat: QuestionStat;
  index: number;
  isHighest?: boolean;
  isLowest?: boolean;
}

export const QuestionDistributionBar: React.FC<QuestionDistributionBarProps> = ({
  questionStat,
  index,
  isHighest = false,
  isLowest = false
}) => {
  const { questionText, categoryLabel, stats, distribution, distributionPercentages, totalAnswers } = questionStat;

  const colors: Record<number, { bg: string; text: string; hex: string }> = {
    5: { bg: 'bg-emerald-500', text: 'text-emerald-700', hex: '#10b981' },
    4: { bg: 'bg-indigo-500', text: 'text-indigo-700', hex: '#6366f1' },
    3: { bg: 'bg-slate-400', text: 'text-slate-700', hex: '#94a3b8' },
    2: { bg: 'bg-amber-500', text: 'text-amber-700', hex: '#f59e0b' },
    1: { bg: 'bg-rose-500', text: 'text-rose-700', hex: '#f43f5e' }
  };

  return (
    <div
      className={`p-5 rounded-xl border transition-all ${
        isHighest
          ? 'bg-emerald-50/30 border-emerald-300 ring-1 ring-emerald-200'
          : isLowest
          ? 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header with Badges & Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 font-mono">Q{index + 1}</span>
            {categoryLabel && (
              <span className="text-[11px] font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/80">
                {categoryLabel}
              </span>
            )}
            {isHighest && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-300">
                <Award size={12} className="text-emerald-700" />
                <span>가장 만족도 높은 문항 (1위)</span>
              </span>
            )}
            {isLowest && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
                <AlertCircle size={12} className="text-amber-700" />
                <span>상대적 개선 필요 문항</span>
              </span>
            )}
          </div>
          <h4 className="text-xs font-bold text-slate-900 leading-snug">
            {questionText}
          </h4>
        </div>

        {/* Statistical Summary Tags (평균, 중앙값, 최빈값) */}
        {stats && (
          <div className="flex items-center gap-2 shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80 text-xs">
            <div className="text-center px-1">
              <span className="text-[10px] text-slate-400 block">평균(Mean)</span>
              <span className="font-bold font-mono text-indigo-700">{stats.mean}점</span>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div className="text-center px-1">
              <span className="text-[10px] text-slate-400 block">중앙값(Median)</span>
              <span className="font-bold font-mono text-slate-800">{stats.median}점</span>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div className="text-center px-1">
              <span className="text-[10px] text-slate-400 block">최빈값(Mode)</span>
              <span className="font-bold font-mono text-slate-800">{stats.mode.join(',')}점</span>
            </div>
          </div>
        )}
      </div>

      {/* Stacked Horizontal Bar Distribution */}
      {distribution && distributionPercentages && (
        <div className="space-y-2">
          {/* Visual Bar */}
          <div className="flex h-5 w-full rounded-md overflow-hidden bg-slate-100 font-mono text-[10px] text-white font-medium text-center leading-5 shadow-2xs">
            {[5, 4, 3, 2, 1].map(score => {
              const count = distribution[score] || 0;
              const pct = distributionPercentages[score] || 0;
              if (count === 0) return null;

              return (
                <div
                  key={score}
                  style={{ width: `${pct}%`, backgroundColor: colors[score].hex }}
                  className="transition-all hover:opacity-90 relative group"
                  title={`${score}점 (${LIKERT_LABELS[score]}): ${count}명 (${pct}%)`}
                >
                  <span className="hidden sm:inline">
                    {pct >= 6 ? `${score}점(${pct}%)` : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Granular Breakdown Legend for each Likert Score */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px] text-slate-600">
            {[5, 4, 3, 2, 1].map(score => {
              const count = distribution[score] || 0;
              const pct = distributionPercentages[score] || 0;

              return (
                <div
                  key={score}
                  className="p-1.5 rounded-md bg-slate-50/80 border border-slate-200/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: colors[score].hex }}
                    />
                    <span className="text-slate-700 font-medium truncate">
                      {score}점 {LIKERT_LABELS[score]}
                    </span>
                  </div>
                  <span className="font-mono tabular-nums text-slate-500 font-semibold shrink-0 ml-1">
                    {pct}% <span className="text-[10px] text-slate-400 font-normal">({count}명)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
