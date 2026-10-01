import React, { useState } from 'react';
import { Survey, SurveyResponse } from '../types/survey';
import { LIKERT_LABELS } from '../utils/analytics';
import {
  CheckCircle2,
  ArrowLeft,
  Send,
  User,
  Users,
  AlertCircle,
  ArrowRight,
  Sparkles,
  School
} from 'lucide-react';

interface StudentSurveyViewProps {
  survey: Survey;
  onBackToAdmin: () => void;
  onSubmitResponse: (response: SurveyResponse) => void;
  initialTarget?: 'student' | 'parent';
}

export const StudentSurveyView: React.FC<StudentSurveyViewProps> = ({
  survey,
  onBackToAdmin,
  onSubmitResponse,
  initialTarget
}) => {
  // If initialTarget is provided via URL parameter or button, start with that role;
  // otherwise start on the Gate screen (null).
  const [selectedRole, setSelectedRole] = useState<'student' | 'parent' | null>(initialTarget || null);
  const [grade, setGrade] = useState<1 | 2 | 3>(2);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isParent = selectedRole === 'parent';

  const handleLikertSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setErrorNotice(null);
  };

  const answeredCount = survey.questions.filter(
    q => answers[q.id] !== undefined && answers[q.id] !== ''
  ).length;
  const progressPercent = survey.questions.length > 0
    ? Math.round((answeredCount / survey.questions.length) * 100)
    : 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      setSelectedRole('student');
      return;
    }

    for (const q of survey.questions) {
      if (answers[q.id] === undefined || answers[q.id] === '') {
        setErrorNotice('모든 문항에 답변해 주세요.');
        const element = document.getElementById(`q_anchor_${q.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    const newResponse: SurveyResponse = {
      id: `resp-${selectedRole}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      surveyId: survey.id,
      respondentType: selectedRole,
      grade,
      answers,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    onSubmitResponse(newResponse);
    setIsSubmitted(true);
  };

  const satisfactionScales = [
    { value: 1, label: LIKERT_LABELS[1], color: 'hover:border-rose-400' },
    { value: 2, label: LIKERT_LABELS[2], color: 'hover:border-amber-400' },
    { value: 3, label: LIKERT_LABELS[3], color: 'hover:border-slate-400' },
    { value: 4, label: LIKERT_LABELS[4], color: 'hover:border-indigo-400' },
    { value: 5, label: LIKERT_LABELS[5], color: 'hover:border-emerald-400' }
  ];

  const awarenessScales = [
    { value: 1, label: '전혀 모름', color: 'hover:border-rose-400' },
    { value: 2, label: '잘 모름', color: 'hover:border-amber-400' },
    { value: 3, label: '보통', color: 'hover:border-slate-400' },
    { value: 4, label: '알고 있음', color: 'hover:border-indigo-400' },
    { value: 5, label: '매우 잘 앎', color: 'hover:border-emerald-400' }
  ];

  // Dynamic question phrasing for Student vs Parent
  const getQuestionText = (q: any) => {
    if (isParent) {
      if (q.category === 'program_awareness') {
        return '학교에서 학생들의 바른 인성과 행복한 성장을 위해 다양한 인성 교육 프로그램이 운영되고 있음을 알고 계십니까?';
      }
      if (q.category === 'teacher_communication') {
        return '학교 인성 프로그램을 통해 자녀가 선생님, 친구들과 더 따뜻하게 소통하고 교우 관계가 원만해졌다고 느낍니다.';
      }
      if (q.category === 'class_participation') {
        return '인성 활동을 통해 자녀가 스스로를 소중히 여기며 밝고 긍정적인 태도로 학교생활을 하는 데 도움이 되었습니다.';
      }
      if (q.category === 'peer_relationship') {
        return '학교의 다양한 인성 교육을 통해 서로를 배려하고 존중하는 밝고 건강한 학교 문화가 조성되고 있음을 느낍니다.';
      }
      if (q.category === 'overall_satisfaction') {
        return '올 한 해 학교에서 운영된 전반적인 인성 프로그램에 학부모로서 만족하며, 이러한 활동이 앞으로도 지속되기를 희망합니다.';
      }
    }
    return q.text;
  };

  // 1. SUBMISSION COMPLETE SCREEN
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
              isParent ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
            }`}>
              {isParent ? '👨‍👩‍👧 학부모 만족도 조사 완료' : '👨‍🎓 학생 만족도 조사 완료'}
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              {isParent ? '학부모 만족도 조사가 접수되었습니다' : '학생 만족도 조사가 접수되었습니다'}
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              설문에 참여해 주셔서 대단히 감사합니다.<br />
              보내주신 평가는 <strong className="text-slate-700">{isParent ? '학부모 전용 통계자료' : '학생 전용 통계자료'}</strong>에 분리 집계되어 학교 인성교육을 더욱 알차게 발전시키는 데 반영됩니다.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
            <p>응답 구분: <strong className={isParent ? 'text-emerald-700' : 'text-indigo-700'}>{isParent ? '학부모 응답' : '학생 응답'}</strong></p>
            <p>해당 학년: <strong className="text-slate-800">{grade}학년</strong></p>
            <p>접수 일시: <span className="font-mono text-slate-500">{new Date().toLocaleString('ko-KR')}</span></p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                setAnswers({});
                setIsSubmitted(false);
                setSelectedRole(null);
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
            >
              처음 화면으로 돌아가기
            </button>
            <button
              onClick={onBackToAdmin}
              className="w-full py-2.5 px-4 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              관리자 분석 화면으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. FIRST SCREEN: ROLE SELECTION GATE (처음 접속 시 오직 학생/학부모만 선택)
  if (selectedRole === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 font-sans">
        {/* Top Mini Nav */}
        <header className="max-w-2xl mx-auto w-full flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <School size={16} />
            </div>
            <span className="text-xs font-bold text-slate-800">{survey.schoolName}</span>
          </div>

          <button
            onClick={onBackToAdmin}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>관리자 대시보드</span>
          </button>
        </header>

        {/* Central Gate Card */}
        <main className="max-w-xl mx-auto w-full my-auto py-8">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Sparkles size={13} />
              <span>{survey.programCategory} · {survey.schoolName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              2026 인성 프로그램 만족도 조사
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              본 설문은 학생과 학부모님의 통계를 각각 구분하여 분석합니다.<br />
              <strong>설문에 참여하실 대상을 먼저 선택해 주세요.</strong>
            </p>
          </div>

          {/* TWO PRIMARY GATE BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Entrance */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setErrorNotice(null);
              }}
              className="group p-6 bg-white hover:bg-indigo-50/50 border-2 border-slate-200 hover:border-indigo-500 rounded-2xl shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center font-bold text-2xl transition-colors shadow-2xs">
                  👨‍🎓
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-600 block mb-1">
                    신비고 1·2·3학년 재학생
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                    학생 설문 참여
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    학생 본인이 직접 경험한 인성 교육과 활동에 대해 응답합니다.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                <span>학생 설문 시작하기</span>
                <ArrowRight size={15} />
              </div>
            </button>

            {/* Parent Entrance (Very prominent for parents) */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('parent');
                setErrorNotice(null);
              }}
              className="group p-6 bg-white hover:bg-emerald-50/50 border-2 border-emerald-400 hover:border-emerald-600 rounded-2xl shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer relative ring-2 ring-emerald-100"
            >
              {/* Highlight badge */}
              <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                <span>학부모님 클릭</span>
              </div>

              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center font-bold text-2xl transition-colors shadow-2xs">
                  👨‍👩‍👧
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 block mb-1">
                    1·2·3학년 자녀를 둔 보호자
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-950 transition-colors">
                    학부모 설문 참여
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    가정에서 지켜본 자녀의 긍정적 변화와 학교 인성 교육을 평가합니다.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                <span>학부모 설문 시작하기</span>
                <ArrowRight size={15} />
              </div>
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            총 5개 문항으로 약 1분 소요되며, 학생과 학부모의 결과는 분리 집계됩니다.
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-slate-400">
          {survey.schoolName}
        </footer>
      </div>
    );
  }

  // 3. SECOND SCREEN: ACTUAL SURVEY QUESTIONNAIRE
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedRole(null)}
              className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg"
            >
              <ArrowLeft size={14} />
              <span>대상 다시 선택</span>
            </button>
            <div className="h-3 w-px bg-slate-200" />
            <span className="text-xs text-slate-600 font-bold">{survey.schoolName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
              isParent ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
            }`}>
              {isParent ? '👨‍👩‍👧 학부모 설문 진행 중' : '👨‍🎓 학생 설문 진행 중'}
            </span>
            <span className="text-xs font-mono tabular-nums text-slate-500 font-semibold ml-1">
              진행률 {progressPercent}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100">
          <div
            className={`h-full transition-all duration-300 ${isParent ? 'bg-emerald-600' : 'bg-indigo-600'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {/* Selected Role Notification Banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isParent
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
            : 'bg-indigo-50/90 border-indigo-300 text-indigo-950'
        }`}>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-lg">{isParent ? '👨‍👩‍👧' : '👨‍🎓'}</span>
            <span>
              현재 <strong>[{isParent ? '학부모 설문' : '학생 설문'}]</strong>에 응답하고 계십니다.
            </span>
          </div>
          <button
            onClick={() => setSelectedRole(null)}
            className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
          >
            변경
          </button>
        </div>

        {/* Survey Title Card */}
        <div className={`bg-white rounded-xl border p-6 shadow-xs ${
          isParent ? 'border-emerald-200' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold mb-1.5">
            <span className={isParent ? 'text-emerald-700' : 'text-indigo-700'}>{survey.programCategory}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">{survey.schoolName}</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 leading-snug">
            {isParent
              ? '2026학년도 신일비즈니스고 인성 프로그램 [학부모 인지도 및 만족도 조사]'
              : '2026학년도 신일비즈니스고 인성 프로그램 [학생 인지도 및 만족도 조사]'}
          </h1>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {isParent
              ? '학부모님의 시각에서 학교 인성 프로그램에 대한 인지도와 자녀의 긍정적인 학교생활 효과에 대한 소중한 평가를 들려주세요. 응답 결과는 [학부모 통계자료]로 분리 집계됩니다.'
              : survey.description}
          </p>
        </div>

        {/* Grade Selection: 1, 2, 3학년만 선택 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">
              {isParent ? '자녀 해당 학년 선택' : '학생 학년 선택'}
            </h3>
            <span className="text-[11px] text-slate-400">1, 2, 3학년 중 선택해 주세요</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(g => (
              <button
                type="button"
                key={g}
                onClick={() => setGrade(g as 1 | 2 | 3)}
                className={`py-3 px-4 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  grade === g
                    ? isParent
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {g}학년
              </button>
            ))}
          </div>
        </div>

        {/* 5 Questionnaire Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900">
              {isParent ? '학부모 설문 문항 응답 (총 5문항)' : '학생 설문 문항 응답 (총 5문항)'}
            </h3>
            <span className="text-[11px] text-slate-400">모든 문항에 답변해 주세요</span>
          </div>

          {errorNotice && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {survey.questions.map((q, idx) => {
            const currentVal = answers[q.id];
            const dynamicText = getQuestionText(q);
            const isAwarenessQ = q.category === 'program_awareness';
            const scalesToUse = isAwarenessQ ? awarenessScales : satisfactionScales;

            return (
              <div
                key={q.id}
                id={`q_anchor_${q.id}`}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                {/* Question Header */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-indigo-600 font-mono">문항 {idx + 1}</span>
                    {q.categoryLabel && (
                      <span className="text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {q.categoryLabel}
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 leading-snug">
                    {dynamicText}
                  </h2>
                </div>

                {/* 5-Point Likert Scale */}
                <div className="pt-2">
                  <div className="grid grid-cols-5 gap-1.5">
                    {scalesToUse.map(item => {
                      const isSelected = currentVal === item.value;
                      return (
                        <button
                          type="button"
                          key={item.value}
                          onClick={() => handleLikertSelect(q.id, item.value)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                            isSelected
                              ? isParent
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : `bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 ${item.color}`
                          }`}
                        >
                          <span className="text-sm font-bold font-mono tabular-nums mb-1">
                            {item.value}점
                          </span>
                          <span
                            className={`text-[10px] leading-tight ${
                              isSelected ? 'text-white font-semibold' : 'text-slate-600 font-medium'
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className={`w-full py-3.5 px-6 text-sm font-bold text-white rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isParent
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Send size={16} />
              <span>{isParent ? '학부모 설문 최종 제출하기' : '학생 설문 최종 제출하기'}</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              제출 즉시 {isParent ? '학부모 통계자료' : '학생 통계자료'}로 구분되어 실시간 반영됩니다.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};
