import React from 'react';
import { Survey, SurveyResponse } from '../types/survey';
import { calculateAnalytics } from '../utils/analytics';
import { ArrowLeft, Printer } from 'lucide-react';

interface PrintReportViewProps {
  survey: Survey;
  responses: SurveyResponse[];
  onBack: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  survey,
  responses,
  onBack
}) => {
  const studentResponses = responses.filter(r => r.respondentType === 'student');
  const parentResponses = responses.filter(r => r.respondentType === 'parent');

  const studentAnalytics = calculateAnalytics(survey, studentResponses);
  const parentAnalytics = calculateAnalytics(survey, parentResponses);
  const totalAnalytics = calculateAnalytics(survey, responses);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:p-0 print:bg-white text-slate-900 font-sans">
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>대시보드로 돌아가기</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">인쇄 창에서 'PDF로 저장'을 선택할 수 있습니다.</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Printer size={14} />
            <span>보고서 인쇄 / PDF 저장</span>
          </button>
        </div>
      </div>

      {/* Official Printable Document Container */}
      <article className="max-w-4xl mx-auto bg-white p-10 sm:p-14 border border-slate-300 shadow-sm print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-8">
          <div className="flex justify-between items-baseline text-xs text-slate-500 mb-2">
            <span>문서번호: 신비인성-2026-0520</span>
            <span>작성일자: {new Date().toLocaleDateString('ko-KR')}</span>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-950 tracking-tight">
            {survey.schoolName} 인성 프로그램 만족도 조사 결과 보고서
          </h1>
          <p className="text-center text-xs text-slate-600 mt-2 font-semibold">
            - 신비고 인성브랜드 "신비한 가치, 신비스럽게 잇다" 학생 및 학부모 만족도 분석 -
          </p>
        </div>

        {/* 1. Overview */}
        <section className="mb-8 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 border-l-4 border-slate-900 pl-2 mb-3">
            1. 설문 조사 개요 및 참여 표본
          </h2>
          <table className="w-full text-xs border-collapse border border-slate-300 text-left">
            <tbody>
              <tr>
                <th className="w-28 bg-slate-100 p-2.5 border border-slate-300 font-semibold text-slate-800">
                  프로그램명
                </th>
                <td className="p-2.5 border border-slate-300">{survey.title}</td>
                <th className="w-28 bg-slate-100 p-2.5 border border-slate-300 font-semibold text-slate-800">
                  주관 기관
                </th>
                <td className="p-2.5 border border-slate-300">{survey.hostName}</td>
              </tr>
              <tr>
                <th className="bg-slate-100 p-2.5 border border-slate-300 font-semibold text-slate-800">
                  조사 대상
                </th>
                <td className="p-2.5 border border-slate-300">
                  {survey.schoolName} 학생 및 학부모 (1, 2, 3학년)
                </td>
                <th className="bg-slate-100 p-2.5 border border-slate-300 font-semibold text-slate-800">
                  조사 기간
                </th>
                <td className="p-2.5 border border-slate-300 font-mono">
                  {survey.startDate} ~ {survey.endDate}
                </td>
              </tr>
              <tr>
                <th className="bg-slate-100 p-2.5 border border-slate-300 font-semibold text-slate-800">
                  표본 구성
                </th>
                <td colSpan={3} className="p-2.5 border border-slate-300">
                  총 <strong className="font-mono">{responses.length}</strong>명 [
                  <strong>학생: {studentResponses.length}명</strong> (1학년 {studentAnalytics.gradeDistribution.grade1} / 2학년 {studentAnalytics.gradeDistribution.grade2} / 3학년 {studentAnalytics.gradeDistribution.grade3}) · 
                  <strong> 학부모: {parentResponses.length}명</strong> (1학년 {parentAnalytics.gradeDistribution.grade1} / 2학년 {parentAnalytics.gradeDistribution.grade2} / 3학년 {parentAnalytics.gradeDistribution.grade3})]
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 2. Student vs Parent Comparison Table */}
        <section className="mb-8 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 border-l-4 border-slate-900 pl-2 mb-3">
            2. 학생 vs 학부모 만족도 통계 비교 분석
          </h2>
          
          {/* Top Score Comparison Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <div className="border border-slate-300 p-3 bg-slate-50">
              <span className="text-[11px] text-slate-500 block mb-1">학생 전체 평균 ({studentResponses.length}명)</span>
              <span className="text-xl font-bold font-mono text-indigo-700">
                {studentAnalytics.overallStats.mean.toFixed(2)} / 5.00점
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">중앙값 {studentAnalytics.overallStats.median}점 · 최빈값 {studentAnalytics.overallStats.modeLabel}</span>
            </div>
            <div className="border border-slate-300 p-3 bg-slate-50">
              <span className="text-[11px] text-slate-500 block mb-1">학부모 전체 평균 ({parentResponses.length}명)</span>
              <span className="text-xl font-bold font-mono text-emerald-700">
                {parentAnalytics.overallStats.mean.toFixed(2)} / 5.00점
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">중앙값 {parentAnalytics.overallStats.median}점 · 최빈값 {parentAnalytics.overallStats.modeLabel}</span>
            </div>
            <div className="border border-slate-300 p-3 bg-slate-50">
              <span className="text-[11px] text-slate-500 block mb-1">통합 전체 평균 ({responses.length}명)</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {totalAnalytics.overallStats.mean.toFixed(2)} / 5.00점
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">(100점 환산 {(totalAnalytics.overallStats.mean * 20).toFixed(1)}점)</span>
            </div>
          </div>

          {/* Detailed Question Comparison Table */}
          <table className="w-full text-xs border-collapse border border-slate-300 text-left">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 border border-slate-300 w-12 text-center">번호</th>
                <th className="p-2 border border-slate-300 w-28">영역</th>
                <th className="p-2 border border-slate-300">조사 문항 내용</th>
                <th className="p-2 border border-slate-300 text-center w-20">학생 평균</th>
                <th className="p-2 border border-slate-300 text-center w-20">학부모 평균</th>
                <th className="p-2 border border-slate-300 text-center w-24">격차(차이)</th>
              </tr>
            </thead>
            <tbody>
              {survey.questions.map((q, idx) => {
                const sStat = studentAnalytics.questionStats.find(qs => qs.questionId === q.id);
                const pStat = parentAnalytics.questionStats.find(qs => qs.questionId === q.id);
                const sMean = sStat?.stats?.mean || 0;
                const pMean = pStat?.stats?.mean || 0;
                const diff = Number((pMean - sMean).toFixed(2));

                return (
                  <tr key={q.id}>
                    <td className="p-2 border border-slate-300 text-center font-mono font-bold text-slate-500">
                      문항 {idx + 1}
                    </td>
                    <td className="p-2 border border-slate-300 font-semibold text-indigo-900">
                      {q.categoryLabel}
                    </td>
                    <td className="p-2 border border-slate-300 text-slate-700">
                      {q.text}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono font-bold text-indigo-700">
                      {sMean.toFixed(2)}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono font-bold text-emerald-700">
                      {pMean.toFixed(2)}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono text-[11px]">
                      {diff > 0 ? `+${diff} (학부모)` : diff < 0 ? `${diff} (학생)` : '0.00 (동일)'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* 3. Action Items */}
        <section className="mb-10 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 border-l-4 border-slate-900 pl-2 mb-3">
            3. 차기 학기 인성교육 발전을 위한 제언
          </h2>
          <ol className="list-decimal list-inside text-xs space-y-2 text-slate-800 leading-relaxed pl-1">
            {totalAnalytics.recommendations.actionItems.map((item, idx) => (
              <li key={idx} className="font-semibold">
                {item}
              </li>
            ))}
          </ol>
        </section>

        {/* Sign-off */}
        <div className="mt-14 pt-8 border-t border-slate-300 flex justify-between items-center text-xs text-slate-700 print-break-inside-avoid">
          <div>
            <p>보고 기관: {survey.schoolName}</p>
            <p className="mt-1">담당 연락처: 신일비즈니스고등학교 교무실 (031-929-2161)</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm text-slate-900">{survey.schoolName}</p>
            <p className="text-slate-500 mt-1">인성교육 운영협의체 (직인생략)</p>
          </div>
        </div>
      </article>
    </div>
  );
};
