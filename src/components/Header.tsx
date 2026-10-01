import React from 'react';
import { ExternalLink, Plus } from 'lucide-react';

interface HeaderProps {
  currentView: 'admin_dashboard' | 'survey_list' | 'print_report' | 'respondent_view';
  onNavigate: (view: 'admin_dashboard' | 'survey_list') => void;
  onOpenCreateSurvey: () => void;
  onOpenRespondentMode: (target?: 'student' | 'parent') => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenCreateSurvey,
  onOpenRespondentMode,
  onOpenShareModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('admin_dashboard');
            }}
            className="text-base font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors whitespace-nowrap"
          >
            신일비즈니스고 인성e-설문
          </a>
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium border-l border-slate-200 pl-3">
            인성프로그램 만족도 조사 관리시스템
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('admin_dashboard')}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              currentView === 'admin_dashboard'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'hover:text-slate-900 border-b-2 border-transparent'
            }`}
          >
            결과 분석
          </button>
          <button
            onClick={() => onNavigate('survey_list')}
            className={`transition-colors whitespace-nowrap pb-0.5 ${
              currentView === 'survey_list'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'hover:text-slate-900 border-b-2 border-transparent'
            }`}
          >
            설문 목록
          </button>
          <button
            onClick={onOpenShareModal}
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            배포·공유
          </button>
          <button
            onClick={onOpenCreateSurvey}
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            새 설문
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenRespondentMode('student')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer border border-indigo-200/60"
          >
            <ExternalLink size={12} />
            <span>👨‍🎓 학생 설문</span>
          </button>
          <button
            onClick={() => onOpenRespondentMode('parent')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer border border-emerald-300"
          >
            <ExternalLink size={12} />
            <span>👨‍👩‍👧 학부모 설문</span>
          </button>
        </div>
      </div>
    </header>
  );
};
