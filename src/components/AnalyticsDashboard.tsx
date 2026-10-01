import React, { useState, useMemo } from 'react';
import { Survey, SurveyResponse } from '../types/survey';
import { calculateAnalytics, CATEGORY_LABELS, exportSurveyToCSV } from '../utils/analytics';
import {
  Share2,
  Download,
  Printer,
  ExternalLink,
  Filter,
  CheckCircle2,
  Users,
  User,
  GitCompare,
  School,
  QrCode
} from 'lucide-react';

interface AnalyticsDashboardProps {
  survey: Survey;
  responses: SurveyResponse[];
  onOpenShareModal: () => void;
  onOpenPrintReport: () => void;
  onOpenSurveyRespondentView: (target?: 'student' | 'parent') => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  survey,
  responses,
  onOpenShareModal,
  onOpenPrintReport,
  onOpenSurveyRespondentView
}) => {
  // Official School Enrollment Targets (전체학년 인원 정원)
  const GRADE_ENROLLMENT = {
    1: 125,
    2: 95,
    3: 133,
    total: 353
  };

  // Main target mode: 'student' | 'parent' | 'comparison' | 'all'
  const [viewMode, setViewMode] = useState<'student' | 'parent' | 'comparison' | 'all'>('student');
  const [gradeFilter, setGradeFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'charts' | 'question_bars'>('charts');

  // Separate calculations
  const studentResponses = useMemo(() => responses.filter(r => r.respondentType === 'student'), [responses]);
  const parentResponses = useMemo(() => responses.filter(r => r.respondentType === 'parent'), [responses]);

  // Overall student stats (without grade filter)
  const studentTotalAnalytics = useMemo(() => calculateAnalytics(survey, studentResponses), [survey, studentResponses]);
  const parentTotalAnalytics = useMemo(() => calculateAnalytics(survey, parentResponses), [survey, parentResponses]);

  // Filtered dataset according to viewMode & gradeFilter
  const activeDataset = useMemo(() => {
    if (viewMode === 'student') return studentResponses;
    if (viewMode === 'parent') return parentResponses;
    return responses;
  }, [viewMode, studentResponses, parentResponses, responses]);

  const activeAnalytics = useMemo(() => {
    return calculateAnalytics(survey, activeDataset, {
      grade: gradeFilter
    });
  }, [survey, activeDataset, gradeFilter]);

  const handleExportCSV = () => {
    const targetLabel = viewMode === 'student' ? '학생' : viewMode === 'parent' ? '학부모' : '전체';
    const targetData = viewMode === 'student' ? studentResponses : viewMode === 'parent' ? parentResponses : responses;
    exportSurveyToCSV(survey, targetData, targetLabel);
  };

  // Grade participant counts
  const studentGradeCounts = {
    1: studentResponses.filter(r => r.grade === 1).length,
    2: studentResponses.filter(r => r.grade === 2).length,
    3: studentResponses.filter(r => r.grade === 3).length
  };

  const parentGradeCounts = {
    1: parentResponses.filter(r => r.grade === 1).length,
    2: parentResponses.filter(r => r.grade === 2).length,
    3: parentResponses.filter(r => r.grade === 3).length
  };

  const activeGradeCounts = {
    1: activeDataset.filter(r => r.grade === 1).length,
    2: activeDataset.filter(r => r.grade === 2).length,
    3: activeDataset.filter(r => r.grade === 3).length
  };

  const totalEnrollmentTarget = GRADE_ENROLLMENT.total;
  const currentTotalParticipants = activeDataset.length;
  const overallParticipationRate = totalEnrollmentTarget > 0
    ? ((currentTotalParticipants / totalEnrollmentTarget) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Zone */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-800">{survey.schoolName}</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-600 font-semibold">{survey.programCategory}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-snug">
              {survey.title}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              전교생 정원(353명: 1학년 125명, 2학년 95명, 3학년 133명)을 기준으로 학생과 학부모님의 응답 통계를 실시간 분석합니다.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenShareModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 size={14} />
              <span>설문 링크 & QR</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>{viewMode === 'student' ? '학생 CSV' : viewMode === 'parent' ? '학부모 CSV' : '전체 CSV'} 다운로드</span>
            </button>
            <button
              onClick={onOpenPrintReport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>보고서 인쇄</span>
            </button>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => onOpenSurveyRespondentView('student')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 rounded-md shadow-2xs transition-colors cursor-pointer"
              >
                <ExternalLink size={12} />
                <span>👨‍🎓 학생 설문</span>
              </button>
              <button
                onClick={() => onOpenSurveyRespondentView('parent')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 rounded-md shadow-2xs transition-colors cursor-pointer"
              >
                <ExternalLink size={12} />
                <span>👨‍👩‍👧 학부모 설문</span>
              </button>
            </div>
          </div>
        </div>

        {/* OFFICIAL ENROLLMENT TARGET & RESPONSE PROGRESS BAR */}
        <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <School size={15} className="text-slate-600" />
              <span className="text-xs font-bold text-slate-800">
                신일비즈니스고 학년별 정원 및 응답 참여 현황 (총 정원 353명)
              </span>
            </div>
            <div className="text-xs text-slate-600 font-mono">
              전체 응답: <strong className="text-indigo-700">{responses.length}명</strong> / 정원 353명 ({((responses.length / 353) * 100).toFixed(1)}%)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Grade 1: 125명 */}
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">1학년 (정원 125명)</span>
                <span className="text-[11px] text-slate-500">
                  학생 {studentGradeCounts[1]}명 · 학부모 {parentGradeCounts[1]}명
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-indigo-700">
                  {studentGradeCounts[1] + parentGradeCounts[1]}건
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {(((studentGradeCounts[1] + parentGradeCounts[1]) / 125) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Grade 2: 95명 */}
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">2학년 (정원 95명)</span>
                <span className="text-[11px] text-slate-500">
                  학생 {studentGradeCounts[2]}명 · 학부모 {parentGradeCounts[2]}명
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-indigo-700">
                  {studentGradeCounts[2] + parentGradeCounts[2]}건
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {(((studentGradeCounts[2] + parentGradeCounts[2]) / 95) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Grade 3: 133명 */}
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">3학년 (정원 133명)</span>
                <span className="text-[11px] text-slate-500">
                  학생 {studentGradeCounts[3]}명 · 학부모 {parentGradeCounts[3]}명
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-indigo-700">
                  {studentGradeCounts[3] + parentGradeCounts[3]}건
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {(((studentGradeCounts[3] + parentGradeCounts[3]) / 133) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY VIEW SEGMENTED SELECTOR: 학생 통계 vs 학부모 통계 vs 비교분석 */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold w-full sm:w-auto">
              <button
                onClick={() => setViewMode('student')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'student'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User size={15} />
                <span>학생 만족도 통계 ({studentResponses.length}명)</span>
              </button>
              <button
                onClick={() => setViewMode('parent')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'parent'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users size={15} />
                <span>학부모 만족도 통계 ({parentResponses.length}명)</span>
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'comparison'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GitCompare size={15} />
                <span>학생 vs 학부모 비교 분석</span>
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>통합 ({responses.length}명)</span>
              </button>
            </div>
          </div>

          {/* Grade filter row (when in student, parent, or all mode) */}
          {viewMode !== 'comparison' && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Filter size={13} />
                <span>{viewMode === 'parent' ? '자녀 학년 필터:' : '학생 학년 필터:'}</span>
              </span>
              <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs">
                <button
                  onClick={() => setGradeFilter('all')}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                    gradeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  전체 학년 ({activeDataset.length}명)
                </button>
                <button
                  onClick={() => setGradeFilter(1)}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                    gradeFilter === 1 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1학년 ({activeGradeCounts[1]} / 125명)
                </button>
                <button
                  onClick={() => setGradeFilter(2)}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                    gradeFilter === 2 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2학년 ({activeGradeCounts[2]} / 95명)
                </button>
                <button
                  onClick={() => setGradeFilter(3)}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                    gradeFilter === 3 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3학년 ({activeGradeCounts[3]} / 133명)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ZERO RESPONSES EMPTY STATE NOTICE */}
      {responses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
            <QrCode size={30} />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              현재 접수된 설문 응답이 없습니다 (0명)
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              설문 링크와 QR코드가 준비되었습니다. 학생과 학부모님께 배포하여 응답을 수집하시면 실시간 통계와 그래프가 이곳에 자동으로 표시됩니다.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenShareModal}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Share2 size={14} />
              <span>설문 링크 & QR코드 배포하기</span>
            </button>
            <button
              onClick={() => onOpenSurveyRespondentView('student')}
              className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>👨‍🎓 학생 설문 직접 응답 테스트</span>
            </button>
            <button
              onClick={() => onOpenSurveyRespondentView('parent')}
              className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>👨‍👩‍👧 학부모 설문 직접 응답 테스트</span>
            </button>
          </div>
        </div>
      ) : (
        /* NORMAL DASHBOARD CONTENT WHEN DATA EXISTS */
        <>
          {/* QUICK SUMMARY CARDS: STUDENT VS PARENT OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Student Summary Card */}
            <div
              onClick={() => setViewMode('student')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                viewMode === 'student'
                  ? 'bg-indigo-50/50 border-indigo-400 ring-2 ring-indigo-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1 text-slate-800">
                  <User size={14} className="text-indigo-600" />
                  <span>학생 만족도 통계</span>
                </span>
                <span className="font-mono text-slate-400">총 {studentResponses.length}명</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold font-mono text-indigo-700">
                  {studentTotalAnalytics.overallStats.mean.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 5.00점</span>
                <span className="text-xs font-semibold text-emerald-600 ml-auto">
                  만족율 {studentTotalAnalytics.positivePercentage}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                1학년 {studentTotalAnalytics.gradeDistribution.grade1}명 · 2학년 {studentTotalAnalytics.gradeDistribution.grade2}명 · 3학년 {studentTotalAnalytics.gradeDistribution.grade3}명
              </p>
            </div>

            {/* Parent Summary Card */}
            <div
              onClick={() => setViewMode('parent')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                viewMode === 'parent'
                  ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1 text-slate-800">
                  <Users size={14} className="text-emerald-700" />
                  <span>학부모 만족도 통계</span>
                </span>
                <span className="font-mono text-slate-400">총 {parentResponses.length}명</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold font-mono text-emerald-700">
                  {parentTotalAnalytics.overallStats.mean.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 5.00점</span>
                <span className="text-xs font-semibold text-emerald-600 ml-auto">
                  만족율 {parentTotalAnalytics.positivePercentage}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                1학년 {parentTotalAnalytics.gradeDistribution.grade1}명 · 2학년 {parentTotalAnalytics.gradeDistribution.grade2}명 · 3학년 {parentTotalAnalytics.gradeDistribution.grade3}명
              </p>
            </div>

            {/* Comparison / Gap Card */}
            <div
              onClick={() => setViewMode('comparison')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                viewMode === 'comparison'
                  ? 'bg-indigo-50/50 border-indigo-400 ring-2 ring-indigo-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1 text-slate-800">
                  <GitCompare size={14} className="text-indigo-600" />
                  <span>학생 vs 학부모 격차 분석</span>
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold">비교 보기</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xs text-slate-600">점수 격차:</span>
                <span className="text-2xl font-bold font-mono text-slate-800 ml-2">
                  {Math.abs(parentTotalAnalytics.overallStats.mean - studentTotalAnalytics.overallStats.mean).toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 ml-1">점</span>
                <span className="text-xs font-semibold text-indigo-600 ml-auto">
                  {parentTotalAnalytics.overallStats.mean >= studentTotalAnalytics.overallStats.mean
                    ? '학부모 만족도 우세'
                    : '학생 만족도 우세'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                학생 ({studentResponses.length}명) vs 학부모 ({parentResponses.length}명)
              </p>
            </div>
          </div>

          {/* VIEW: COMPARISON TABLE (학생 vs 학부모) */}
          {viewMode === 'comparison' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    학생 vs 학부모 5개 문항별 통계 비교
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    학생과 학부모님의 응답 평균 및 중앙값을 항목별로 비교하여 분석합니다.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <th className="p-3 font-semibold w-12">번호</th>
                      <th className="p-3 font-semibold">문항 및 영역</th>
                      <th className="p-3 font-semibold text-center text-indigo-700">
                        학생 평균 ({studentResponses.length}명)
                      </th>
                      <th className="p-3 font-semibold text-center text-emerald-700">
                        학부모 평균 ({parentResponses.length}명)
                      </th>
                      <th className="p-3 font-semibold text-center">점수 차이</th>
                      <th className="p-3 font-semibold text-center">분석 인사이트</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {survey.questions.map((q, idx) => {
                      const sStat = studentTotalAnalytics.questionStats.find(s => s.questionId === q.id);
                      const pStat = parentTotalAnalytics.questionStats.find(s => s.questionId === q.id);
                      const sMean = sStat?.stats.mean || 0;
                      const pMean = pStat?.stats.mean || 0;
                      const diff = Number((pMean - sMean).toFixed(2));

                      return (
                        <tr key={q.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-mono font-bold text-slate-500">Q{idx + 1}</td>
                          <td className="p-3">
                            <span className="font-bold text-slate-800 block text-xs">
                              {q.categoryLabel || CATEGORY_LABELS[q.category || ''] || '문항'}
                            </span>
                            <span className="text-slate-600 text-[11px] block mt-0.5 line-clamp-2">
                              {q.text}
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-indigo-700 text-sm">
                            {sMean.toFixed(2)}점
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-700 text-sm">
                            {pMean.toFixed(2)}점
                          </td>
                          <td className="p-3 text-center font-mono text-xs">
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              diff > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : diff < 0
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {diff > 0 ? `+${diff}` : diff}점
                            </span>
                          </td>
                          <td className="p-3 text-center text-[11px] text-slate-600">
                            {q.category === 'program_awareness' ? (
                              diff < 0 ? (
                                <span className="text-amber-700 font-semibold">
                                  가정통신문 및 학부모 알림 강화 권장
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-semibold">
                                  학생·학부모 인지도 모두 양호
                                </span>
                              )
                            ) : diff > 0 ? (
                              '학부모 만족도 높음'
                            ) : (
                              '학생 체감도 높음'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* VIEW: SINGLE AUDIENCE DETAILED CHARTS */
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>
                      {viewMode === 'student' ? '👨‍🎓 학생 만족도 문항별 상세 통계' : viewMode === 'parent' ? '👨‍👩‍👧 학부모 만족도 문항별 상세 통계' : '🏫 전체 통합 문항별 통계'}
                    </span>
                    <span className="text-xs font-mono font-normal text-slate-400">
                      (표본 {activeDataset.length}명)
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    평균, 중앙값, 최빈값 및 5점 척도 분포를 확인할 수 있습니다.
                  </p>
                </div>

                <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs">
                  <button
                    onClick={() => setActiveAnalysisTab('charts')}
                    className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                      activeAnalysisTab === 'charts' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    통계 요약표
                  </button>
                  <button
                    onClick={() => setActiveAnalysisTab('question_bars')}
                    className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                      activeAnalysisTab === 'question_bars' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    척도 분포 그래프
                  </button>
                </div>
              </div>

              {activeAnalysisTab === 'charts' ? (
                /* Question Stat Table */
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                        <th className="p-3 font-semibold w-12">번호</th>
                        <th className="p-3 font-semibold">문항 영역</th>
                        <th className="p-3 font-semibold">설문 내용</th>
                        <th className="p-3 font-semibold text-center">평균 (Mean)</th>
                        <th className="p-3 font-semibold text-center">중앙값 (Median)</th>
                        <th className="p-3 font-semibold text-center">최빈값 (Mode)</th>
                        <th className="p-3 font-semibold text-center">만족율(4~5점)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeAnalytics.questionStats.map((qs, idx) => (
                        <tr key={qs.questionId} className="hover:bg-slate-50/80">
                          <td className="p-3 font-mono font-bold text-slate-500">Q{idx + 1}</td>
                          <td className="p-3 font-semibold text-indigo-700 whitespace-nowrap">
                            {qs.categoryLabel || CATEGORY_LABELS[qs.category || ''] || '문항'}
                          </td>
                          <td className="p-3 text-slate-700 font-medium max-w-md">
                            {qs.questionText}
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-slate-900 text-sm whitespace-nowrap">
                            {(qs.stats?.mean ?? 0).toFixed(2)}점
                          </td>
                          <td className="p-3 text-center font-mono text-slate-700 whitespace-nowrap">
                            {qs.stats?.median ?? 0}점
                          </td>
                          <td className="p-3 text-center font-mono text-slate-700 whitespace-nowrap">
                            {qs.stats?.modeLabel ?? '-'}
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {qs.positivePercentage ?? 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Question Bars (5-Point Likert Distribution) */
                <div className="space-y-6">
                  {activeAnalytics.questionStats.map((qs, idx) => {
                    const dist = qs.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                    const pct = qs.distributionPercentages || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                    const meanVal = (qs.stats?.mean ?? 0).toFixed(2);
                    const medianVal = qs.stats?.median ?? 0;
                    const modeVal = qs.stats?.modeLabel ?? '-';

                    return (
                      <div key={qs.questionId} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-600">Q{idx + 1}</span>
                            <span className="text-xs font-bold text-slate-900">{qs.categoryLabel}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-mono">
                            <span>평균: <strong className="text-indigo-700">{meanVal}점</strong></span>
                            <span>중앙값: <strong>{medianVal}점</strong></span>
                            <span>최빈값: <strong>{modeVal}</strong></span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600">{qs.questionText}</p>

                        {/* 5-bar Stack */}
                        <div className="space-y-1 pt-1">
                          <div className="h-6 w-full flex rounded-lg overflow-hidden border border-slate-200 text-[10px] font-mono font-bold text-white">
                            <div
                              style={{ width: `${pct[5] || 0}%` }}
                              className="bg-emerald-600 flex items-center justify-center transition-all"
                              title={`5점: ${dist[5] || 0}명 (${pct[5] || 0}%)`}
                            >
                              {(pct[5] || 0) > 8 && `${pct[5]}%`}
                            </div>
                            <div
                              style={{ width: `${pct[4] || 0}%` }}
                              className="bg-indigo-500 flex items-center justify-center transition-all"
                              title={`4점: ${dist[4] || 0}명 (${pct[4] || 0}%)`}
                            >
                              {(pct[4] || 0) > 8 && `${pct[4]}%`}
                            </div>
                            <div
                              style={{ width: `${pct[3] || 0}%` }}
                              className="bg-slate-400 flex items-center justify-center transition-all"
                              title={`3점: ${dist[3] || 0}명 (${pct[3] || 0}%)`}
                            >
                              {(pct[3] || 0) > 8 && `${pct[3]}%`}
                            </div>
                            <div
                              style={{ width: `${pct[2] || 0}%` }}
                              className="bg-amber-400 flex items-center justify-center transition-all"
                              title={`2점: ${dist[2] || 0}명 (${pct[2] || 0}%)`}
                            >
                              {(pct[2] || 0) > 8 && `${pct[2]}%`}
                            </div>
                            <div
                              style={{ width: `${pct[1] || 0}%` }}
                              className="bg-rose-400 flex items-center justify-center transition-all"
                              title={`1점: ${dist[1] || 0}명 (${pct[1] || 0}%)`}
                            >
                              {(pct[1] || 0) > 8 && `${pct[1]}%`}
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                              5점: {dist[5] || 0}명 ({pct[5] || 0}%)
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                              4점: {dist[4] || 0}명 ({pct[4] || 0}%)
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                              3점: {dist[3] || 0}명 ({pct[3] || 0}%)
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                              2점: {dist[2] || 0}명 ({pct[2] || 0}%)
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                              1점: {dist[1] || 0}명 ({pct[1] || 0}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
