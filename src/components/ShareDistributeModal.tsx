import React, { useState } from 'react';
import { Survey } from '../types/survey';
import { QRCodeDisplay } from './QRCodeDisplay';
import { X, Copy, Check, Users, User, Share2, QrCode, School } from 'lucide-react';

interface ShareDistributeModalProps {
  survey: Survey;
  isOpen: boolean;
  onClose: () => void;
  onOpenSurveyRespondentView?: (target?: 'student' | 'parent') => void;
}

export const ShareDistributeModal: React.FC<ShareDistributeModalProps> = ({
  survey,
  isOpen,
  onClose,
  onOpenSurveyRespondentView
}) => {
  const [activeTab, setActiveTab] = useState<'parent' | 'student' | 'all'>('parent');
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!isOpen) return null;

  // Base URL calculation (uses exact host URL)
  const currentBaseUrl = typeof window !== 'undefined'
    ? window.location.href.split('?')[0]
    : 'https://school-character-survey.edu';

  const parentSurveyUrl = `${currentBaseUrl}?surveyId=${survey.id}&mode=respondent&target=parent`;
  const studentSurveyUrl = `${currentBaseUrl}?surveyId=${survey.id}&mode=respondent&target=student`;
  const gateSurveyUrl = `${currentBaseUrl}?surveyId=${survey.id}&mode=respondent`;

  const parentNoticeMsg = `[${survey.schoolName} 인성프로그램 학부모 만족도 설문 안내]

학부모님 안녕하십니까?
${survey.schoolName}에서는 학생들의 바른 인성과 행복한 성장을 위해 올 한 해 운영된 인성 교육 프로그램에 대한 학부모님의 소중한 의견을 듣고자 합니다.

■ 설문 대상: 1·2·3학년 자녀를 둔 학부모님
■ 설문 기간: ${survey.startDate} ~ ${survey.endDate}
■ 소요 시간: 약 1분 (총 5개 문항)
■ 학부모 전용 참여 링크: ${parentSurveyUrl}

※ 스마트폰 카메라로 QR코드를 스캔하거나 위 링크를 클릭하시면 [학부모 설문]으로 자동 연결됩니다.
- ${survey.schoolName} 드림 -`;

  const studentNoticeMsg = `[${survey.schoolName} 인성프로그램 학생 만족도 설문 안내]

신비고 학생 여러분 안녕하십니까?
${survey.schoolName}에서는 더 즐겁고 따뜻한 학교를 만들기 위해 학생 여러분의 솔직한 생각을 듣고자 합니다.

■ 설문 대상: 신일비즈니스고 1·2·3학년 재학생
■ 설문 기간: ${survey.startDate} ~ ${survey.endDate}
■ 소요 시간: 약 1분 (총 5개 문항)
■ 학생 전용 참여 링크: ${studentSurveyUrl}

※ 스마트폰 카메라로 QR코드를 스캔하거나 위 링크를 클릭하시면 [학생 설문]으로 자동 연결됩니다.
- ${survey.schoolName} 드림 -`;

  const gateNoticeMsg = `[${survey.schoolName} 인성프로그램 만족도 설문 안내]

학생 및 학부모님 안녕하십니까?
${survey.schoolName}에서는 학생들의 바른 인성과 따뜻한 학교 문화 조성을 위해 2026학년도 인성 프로그램 만족도 조사를 실시합니다.

■ 설문 대상: 신일비즈니스고 학생 및 학부모
■ 설문 기간: ${survey.startDate} ~ ${survey.endDate}
■ 소요 시간: 약 1분 (총 5개 문항)
■ 설문 참여 링크: ${gateSurveyUrl}

※ 첫 화면에서 [학생] 또는 [학부모]를 선택하여 참여해 주시기 바랍니다.
- ${survey.schoolName} 드림 -`;

  const activeMsg = activeTab === 'parent' ? parentNoticeMsg : activeTab === 'student' ? studentNoticeMsg : gateNoticeMsg;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(activeMsg);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <QrCode size={18} className="text-indigo-600" />
              <span>설문 전용 링크 및 QR코드 발급</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              학부모님과 학생이 오접속하지 않도록 전용 링크와 실시간 스캔용 QR코드를 제공합니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3 Tab Switcher */}
        <div className="p-4 bg-slate-100/70 border-b border-slate-200">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('parent')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'parent'
                  ? 'bg-white text-emerald-800 shadow-sm border border-emerald-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={15} className="text-emerald-600" />
              <span>👨‍👩‍👧 학부모용 링크 & QR</span>
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-white text-indigo-800 shadow-sm border border-indigo-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User size={15} className="text-indigo-600" />
              <span>👨‍🎓 학생용 링크 & QR</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School size={15} className="text-slate-600" />
              <span>🏫 통합 선택 링크 & QR</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'parent' && (
            <div className="space-y-4">
              <QRCodeDisplay
                url={parentSurveyUrl}
                title="학부모 만족도 조사 전용 QR코드"
                subtitle="스캔 시 [학부모 설문] 화면으로 바로 연결됩니다."
                badgeText="학부모 전용 · 오접속 방지"
                badgeColorClass="bg-emerald-100 text-emerald-800 border border-emerald-200"
                targetType="parent"
                schoolName={survey.schoolName}
                hostName={survey.hostName}
              />
            </div>
          )}

          {activeTab === 'student' && (
            <div className="space-y-4">
              <QRCodeDisplay
                url={studentSurveyUrl}
                title="학생 만족도 조사 전용 QR코드"
                subtitle="스캔 시 [학생 설문] 화면으로 바로 연결됩니다."
                badgeText="신비고 학생 전용"
                badgeColorClass="bg-indigo-100 text-indigo-800 border border-indigo-200"
                targetType="student"
                schoolName={survey.schoolName}
                hostName={survey.hostName}
              />
            </div>
          )}

          {activeTab === 'all' && (
            <div className="space-y-4">
              <QRCodeDisplay
                url={gateSurveyUrl}
                title="통합 안내용 QR코드"
                subtitle="스캔 시 첫 화면에서 학생/학부모를 먼저 선택하는 화면이 열립니다."
                badgeText="통합 접속 게이트"
                badgeColorClass="bg-slate-100 text-slate-800 border border-slate-200"
                targetType="all"
                schoolName={survey.schoolName}
                hostName={survey.hostName}
              />
            </div>
          )}

          {/* Message Template Section with One-Click Copy */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                {activeTab === 'parent' ? '가정통신문 / 학부모 알림톡 발송용 문구' : activeTab === 'student' ? '학급 단톡방 / 수업 배포용 문구' : '통합 가정통신문 발송용 문구'}
              </label>
              <button
                onClick={handleCopyMessage}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedMsg ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedMsg ? '문구 복사완료' : '전체 문구 복사'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={5}
              value={activeMsg}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 leading-relaxed resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            QR코드는 모든 스마트폰 기본 카메라 앱에서 즉시 인식됩니다.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
