import React from 'react';
import { Survey, SurveyResponse } from '../types/survey';
import { Plus, BarChart3, Share2, Calendar, Users, CheckCircle, Clock, FileEdit, Trash2 } from 'lucide-react';

interface SurveyListProps {
  surveys: Survey[];
  responsesMap: Record<string, SurveyResponse[]>;
  selectedSurveyId: string;
  onSelectSurvey: (surveyId: string) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (survey: Survey) => void;
  onOpenShareModal: (survey: Survey) => void;
  onDeleteSurvey: (surveyId: string) => void;
}

export const SurveyList: React.FC<SurveyListProps> = ({
  surveys,
  responsesMap,
  selectedSurveyId,
  onSelectSurvey,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenShareModal,
  onDeleteSurvey
}) => {
  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            인성프로그램 설문 목록 및 운영 현황
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            등록된 만족도 조사를 관리하고 실시간 분석 결과를 조회하세요.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} />
          <span>새 인성 만족도 설문 만들기</span>
        </button>
      </div>

      {/* Grid of Surveys */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surveys.map(survey => {
          const isSelected = survey.id === selectedSurveyId;
          const responses = responsesMap[survey.id] || [];
          const responseCount = responses.length;
          const progressPercent = survey.targetCount > 0
            ? Math.min(100, Math.round((responseCount / survey.targetCount) * 100))
            : 0;

          const statusBadge = {
            active: { label: '진행 중', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            closed: { label: '설문 마감', color: 'text-slate-600 bg-slate-100 border-slate-200' },
            draft: { label: '준비 중', color: 'text-amber-700 bg-amber-50 border-amber-200' }
          }[survey.status];

          return (
            <div
              key={survey.id}
              className={`bg-white rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="p-5 space-y-3">
                {/* Status and Category */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium truncate">
                    {survey.programCategory}
                  </span>
                </div>

                {/* Survey Title */}
                <div>
                  <h3
                    onClick={() => onSelectSurvey(survey.id)}
                    className="text-sm font-bold text-slate-900 leading-snug cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2"
                  >
                    {survey.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {survey.description}
                  </p>
                </div>

                {/* Period & Target Info */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{survey.startDate} ~ {survey.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      <Users size={13} className="text-slate-400" />
                      <span>수집 응답수</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800 tabular-nums">
                      {responseCount}명 / {survey.targetCount}명 ({progressPercent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectSurvey(survey.id)}
                    className={`font-semibold flex items-center gap-1 transition-colors ${
                      isSelected ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
                    }`}
                  >
                    <BarChart3 size={13} />
                    <span>{isSelected ? '분석 중' : '결과 분석'}</span>
                  </button>
                  <button
                    onClick={() => onOpenShareModal(survey)}
                    className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    <Share2 size={13} />
                    <span>배포</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenEditModal(survey)}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                    title="설문 수정"
                  >
                    <FileEdit size={14} />
                  </button>
                  {surveys.length > 1 && (
                    <button
                      onClick={() => onDeleteSurvey(survey.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="설문 삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
