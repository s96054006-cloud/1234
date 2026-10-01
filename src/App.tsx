import React, { useState, useEffect } from 'react';
import { Survey, SurveyResponse } from './types/survey';
import { INITIAL_SURVEYS, generateSeedResponses } from './data/mockSurveys';
import { Header } from './components/Header';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SurveyList } from './components/SurveyList';
import { StudentSurveyView } from './components/StudentSurveyView';
import { ShareDistributeModal } from './components/ShareDistributeModal';
import { SurveyEditorModal } from './components/SurveyEditorModal';
import { PrintReportView } from './components/PrintReportView';

export default function App() {
  // State for surveys
  const [surveys, setSurveys] = useState<Survey[]>(() => {
    try {
      const saved = localStorage.getItem('school_surveys_data_v5');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_SURVEYS;
  });

  // State for responses: Record<surveyId, SurveyResponse[]>
  const [responsesMap, setResponsesMap] = useState<Record<string, SurveyResponse[]>>(() => {
    try {
      const saved = localStorage.getItem('school_responses_data_v5');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    const initialMap: Record<string, SurveyResponse[]> = {
      [INITIAL_SURVEYS[0].id]: []
    };
    return initialMap;
  });

  const [selectedSurveyId, setSelectedSurveyId] = useState<string>(INITIAL_SURVEYS[0].id);
  const [currentView, setCurrentView] = useState<'admin_dashboard' | 'survey_list' | 'respondent_view' | 'print_report'>('admin_dashboard');
  const [respondentTarget, setRespondentTarget] = useState<'student' | 'parent' | undefined>(undefined);

  // Check URL parameters for direct deep-linking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      const targetParam = params.get('target');
      const surveyIdParam = params.get('surveyId');

      if (surveyIdParam && surveys.some(s => s.id === surveyIdParam)) {
        setSelectedSurveyId(surveyIdParam);
      }

      if (modeParam === 'respondent') {
        if (targetParam === 'parent' || targetParam === 'student') {
          setRespondentTarget(targetParam);
        } else {
          setRespondentTarget(undefined);
        }
        setCurrentView('respondent_view');
      }
    }
  }, [surveys]);

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('school_surveys_data_v5', JSON.stringify(surveys));
    } catch (e) {
      // ignore
    }
  }, [surveys]);

  useEffect(() => {
    try {
      localStorage.setItem('school_responses_data_v5', JSON.stringify(responsesMap));
    } catch (e) {
      // ignore
    }
  }, [responsesMap]);

  // Selected survey object
  const selectedSurvey = surveys.find(s => s.id === selectedSurveyId) || surveys[0];
  const selectedResponses = responsesMap[selectedSurvey?.id] || [];

  // Handler for saving survey (create or update)
  const handleSaveSurvey = (survey: Survey) => {
    if (editingSurvey) {
      setSurveys(surveys.map(s => (s.id === survey.id ? survey : s)));
      showToast('설문 정보가 성공적으로 수정되었습니다.');
    } else {
      setSurveys([survey, ...surveys]);
      setSelectedSurveyId(survey.id);
      showToast('새로운 인성 설문이 등록되었습니다.');
    }
    setEditingSurvey(null);
  };

  // Handler for deleting survey
  const handleDeleteSurvey = (surveyId: string) => {
    if (surveys.length <= 1) {
      showToast('최소 한 개의 설문이 유지되어야 합니다.');
      return;
    }
    const updated = surveys.filter(s => s.id !== surveyId);
    setSurveys(updated);
    if (selectedSurveyId === surveyId) {
      setSelectedSurveyId(updated[0].id);
    }
    showToast('설문이 삭제되었습니다.');
  };

  // Handler for student/parent survey submission
  const handleSubmitResponse = (response: SurveyResponse) => {
    const list = responsesMap[response.surveyId] || [];
    setResponsesMap({
      ...responsesMap,
      [response.surveyId]: [response, ...list]
    });
    showToast('응답이 실시간 통계에 성공적으로 반영되었습니다.');
  };

  // If in respondent view mode
  if (currentView === 'respondent_view' && selectedSurvey) {
    return (
      <StudentSurveyView
        survey={selectedSurvey}
        initialTarget={respondentTarget}
        onBackToAdmin={() => setCurrentView('admin_dashboard')}
        onSubmitResponse={handleSubmitResponse}
      />
    );
  }

  // If in print report mode
  if (currentView === 'print_report' && selectedSurvey) {
    return (
      <PrintReportView
        survey={selectedSurvey}
        responses={selectedResponses}
        onBack={() => setCurrentView('admin_dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenCreateSurvey={() => {
          setEditingSurvey(null);
          setIsEditorModalOpen(true);
        }}
        onOpenRespondentMode={(target) => {
          setRespondentTarget(target || 'student');
          setCurrentView('respondent_view');
        }}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentView === 'admin_dashboard' && selectedSurvey && (
          <AnalyticsDashboard
            survey={selectedSurvey}
            responses={selectedResponses}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenPrintReport={() => setCurrentView('print_report')}
            onOpenSurveyRespondentView={(target) => {
              setRespondentTarget(target || 'student');
              setCurrentView('respondent_view');
            }}
          />
        )}

        {currentView === 'survey_list' && (
          <SurveyList
            surveys={surveys}
            responsesMap={responsesMap}
            selectedSurveyId={selectedSurveyId}
            onSelectSurvey={(id) => {
              setSelectedSurveyId(id);
              setCurrentView('admin_dashboard');
            }}
            onOpenCreateModal={() => {
              setEditingSurvey(null);
              setIsEditorModalOpen(true);
            }}
            onOpenEditModal={(survey) => {
              setEditingSurvey(survey);
              setIsEditorModalOpen(true);
            }}
            onOpenShareModal={(survey) => {
              setSelectedSurveyId(survey.id);
              setIsShareModalOpen(true);
            }}
            onDeleteSurvey={handleDeleteSurvey}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Share / Distribution Modal */}
      {selectedSurvey && (
        <ShareDistributeModal
          survey={selectedSurvey}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onOpenSurveyRespondentView={(target) => {
            setRespondentTarget(target || 'parent');
            setIsShareModalOpen(false);
            setCurrentView('respondent_view');
          }}
        />
      )}

      {/* Survey Editor Modal */}
      <SurveyEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => {
          setIsEditorModalOpen(false);
          setEditingSurvey(null);
        }}
        onSave={handleSaveSurvey}
        initialSurvey={editingSurvey}
      />
    </div>
  );
}
