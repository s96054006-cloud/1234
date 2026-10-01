import React, { useState } from 'react';
import { Survey, Question, RequiredCategory } from '../types/survey';
import { CATEGORY_LABELS } from '../utils/analytics';
import { X, Plus, Trash2, Check, HelpCircle } from 'lucide-react';

interface SurveyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (survey: Survey) => void;
  initialSurvey?: Survey | null;
}

export const SurveyEditorModal: React.FC<SurveyEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSurvey
}) => {
  const [title, setTitle] = useState(
    initialSurvey ? initialSurvey.title : '2026학년도 신일비즈니스고 인성 프로그램 만족도 조사'
  );
  const [subtitle, setSubtitle] = useState(
    initialSurvey ? initialSurvey.subtitle : '신비고 인성브랜드 "신비한 가치, 신비스럽게 잇다" - 인지도 및 만족도 설문'
  );
  const [schoolName, setSchoolName] = useState(
    initialSurvey ? initialSurvey.schoolName : '신일비즈니스고등학교'
  );
  const [hostName, setHostName] = useState(
    initialSurvey ? initialSurvey.hostName : '신일비즈니스고등학교'
  );
  const [programCategory, setProgramCategory] = useState(
    initialSurvey ? initialSurvey.programCategory : '신비고 인성브랜드 프로그램'
  );
  const [targetAudience, setTargetAudience] = useState<'students' | 'parents' | 'both'>(
    initialSurvey ? initialSurvey.targetAudience : 'both'
  );
  const [targetCount, setTargetCount] = useState<number>(
    initialSurvey ? initialSurvey.targetCount : 353
  );
  const [startDate, setStartDate] = useState(
    initialSurvey ? initialSurvey.startDate : new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    initialSurvey ? initialSurvey.endDate : new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  );
  const [description, setDescription] = useState(
    initialSurvey
      ? initialSurvey.description
      : '올 한 해 본교에서 운영된 전반적인 인성 교육 및 활동에 대해 학생 여러분의 소중한 생각을 듣고자 합니다.'
  );

  const [questions, setQuestions] = useState<Question[]>(
    initialSurvey
      ? initialSurvey.questions
      : [
          {
            id: 'q1',
            category: 'program_awareness',
            categoryLabel: '프로그램 인지도',
            text: '우리 학교에서 학생들의 바른 인성과 따뜻한 학교 문화를 위해 다양한 인성 프로그램이 운영되고 있음을 알고 계십니까?',
            type: 'likert',
            required: true,
            description: '5점 척도: 1점(전혀 모름) ~ 5점(매우 잘 알고 있음)'
          },
          {
            id: 'q2',
            category: 'teacher_communication',
            categoryLabel: '소통과 유대감',
            text: '학교 인성 프로그램을 통해 선생님, 친구들과 더 따뜻하게 소통하고 서로를 이해하는 마음이 깊어졌습니다.',
            type: 'likert',
            required: true,
            description: '5점 척도: 1점(매우 불만족) ~ 5점(매우 만족)'
          },
          {
            id: 'q3',
            category: 'class_participation',
            categoryLabel: '자아존중과 긍정적 태도',
            text: '인성 활동에 참여하면서 나 자신을 더 소중히 여기고 긍정적인 마음으로 학교생활을 하는 데 도움이 되었습니다.',
            type: 'likert',
            required: true,
            description: '5점 척도: 1점(매우 불만족) ~ 5점(매우 만족)'
          },
          {
            id: 'q4',
            category: 'peer_relationship',
            categoryLabel: '배려와 공동체 문화',
            text: '학교의 다양한 인성 교육을 통해 서로를 배려하고 존중하는 밝고 따뜻한 학교 분위기를 체감하고 있습니다.',
            type: 'likert',
            required: true,
            description: '5점 척도: 1점(매우 불만족) ~ 5점(매우 만족)'
          },
          {
            id: 'q5',
            category: 'overall_satisfaction',
            categoryLabel: '전반적 만족도',
            text: '올 한 해 학교에서 운영된 전반적인 인성 프로그램에 만족하며, 이러한 긍정적인 활동이 앞으로도 지속되기를 희망합니다.',
            type: 'likert',
            required: true,
            description: '5점 척도: 1점(매우 불만족) ~ 5점(매우 만족)'
          }
        ]
  );

  if (!isOpen) return null;

  const handleAddQuestion = (type: 'likert' | 'single_choice' | 'text') => {
    const newId = `q_${Date.now()}`;
    if (type === 'likert') {
      setQuestions([
        ...questions,
        {
          id: newId,
          text: '새로운 5점 척도 문항을 입력하세요.',
          type: 'likert',
          category: 'custom',
          categoryLabel: '기타 문항',
          required: true
        }
      ]);
    } else if (type === 'single_choice') {
      setQuestions([
        ...questions,
        {
          id: newId,
          text: '선택형 문항을 입력하세요.',
          type: 'single_choice',
          required: true,
          options: ['선택지 1', '선택지 2', '선택지 3']
        }
      ]);
    } else {
      setQuestions([
        ...questions,
        {
          id: newId,
          text: '자유 서술형 문항을 입력하세요.',
          type: 'text',
          required: false
        }
      ]);
    }
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleUpdateQuestionText = (idx: number, text: string) => {
    const updated = [...questions];
    updated[idx].text = text;
    setQuestions(updated);
  };

  const handleUpdateCategory = (idx: number, cat: RequiredCategory) => {
    const updated = [...questions];
    updated[idx].category = cat;
    updated[idx].categoryLabel = CATEGORY_LABELS[cat] || '기타 문항';
    setQuestions(updated);
  };

  const handleUpdateOptions = (idx: number, optionsStr: string) => {
    const updated = [...questions];
    updated[idx].options = optionsStr.split(',').map(s => s.trim()).filter(Boolean);
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSurvey: Survey = {
      id: initialSurvey ? initialSurvey.id : `survey-${Date.now()}`,
      title,
      subtitle,
      description,
      targetAudience,
      targetCount: Number(targetCount) || 200,
      startDate,
      endDate,
      status: initialSurvey ? initialSurvey.status : 'active',
      programCategory,
      schoolName,
      hostName,
      questions,
      createdAt: initialSurvey ? initialSurvey.createdAt : new Date().toISOString().slice(0, 10)
    };

    onSave(newSurvey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialSurvey ? '설문 문항 및 정보 수정' : '새 인성프로그램 설문 생성'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              학부모회 및 학교 인성교육 목표에 맞춰 문항과 대상을 설정하세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                설문 제목 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예: 2026학년도 1학기 사제동행 인성프로그램 만족도 조사"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">학교명</label>
              <input
                type="text"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">주관 주체</label>
              <input
                type="text"
                value={hostName}
                onChange={e => setHostName(e.target.value)}
                placeholder="예: 신일비즈니스고등학교"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">프로그램 분야</label>
              <input
                type="text"
                value={programCategory}
                onChange={e => setProgramCategory(e.target.value)}
                placeholder="예: 회복적 생활교육, 멘토링"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">설문 대상</label>
              <select
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="both">전체 (학생 + 학부모)</option>
                <option value="students">학생 전용</option>
                <option value="parents">학부모 전용</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">목표 응답 인원 (명)</label>
              <input
                type="number"
                min="10"
                max="3000"
                value={targetCount}
                onChange={e => setTargetCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono tabular-nums"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">시작일</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">종료일</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">설문 안내문</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Question List Builder */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">설문 문항 관리 ({questions.length}개)</h3>
                <p className="text-[11px] text-slate-500">인성 핵심역량과 연결하여 통계 분석을 자동화합니다.</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddQuestion('likert')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                >
                  <Plus size={13} />
                  <span>5점 척도 추가</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('single_choice')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  <Plus size={13} />
                  <span>객관식 추가</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('text')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  <Plus size={13} />
                  <span>서술형 추가</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-700 shrink-0">문항 {idx + 1}</span>
                    <span className="text-[11px] text-slate-500">
                      {q.type === 'likert' ? '5점 척도' : q.type === 'single_choice' ? '객관식 선택' : '주관식 서술'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      disabled={questions.length <= 1}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors ml-auto"
                      aria-label="문항 삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={q.text}
                    onChange={e => handleUpdateQuestionText(idx, e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="문항 질문을 입력하세요"
                  />

                  {q.type === 'likert' && (
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <span className="text-slate-500 font-medium">조사 문항 영역:</span>
                      <select
                        value={q.category || 'custom'}
                        onChange={e => handleUpdateCategory(idx, e.target.value as RequiredCategory)}
                        className="px-2 py-1 text-xs border border-slate-300 rounded bg-white font-medium"
                      >
                        <option value="program_awareness">프로그램 인지도</option>
                        <option value="class_participation">수업 참여도</option>
                        <option value="peer_relationship">교우 관계</option>
                        <option value="teacher_communication">교사와의 소통</option>
                        <option value="program_benefit">프로그램 유익성</option>
                        <option value="overall_satisfaction">전반적 만족도</option>
                        <option value="custom">기타 자율 문항</option>
                      </select>
                      <span className="text-[10px] text-slate-400">5점 척도(매우 불만족 ~ 매우 만족)</span>
                    </div>
                  )}

                  {q.type === 'single_choice' && (
                    <div className="pt-1">
                      <label className="text-[11px] text-slate-500 block mb-1">
                        보기 목록 (쉼표 , 로 구분):
                      </label>
                      <input
                        type="text"
                        value={q.options ? q.options.join(', ') : ''}
                        onChange={e => handleUpdateOptions(idx, e.target.value)}
                        placeholder="사제 대화, 숲길 걷기, 칭찬 우체통, 봉사활동"
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Check size={14} />
              <span>{initialSurvey ? '수정사항 저장' : '설문 등록 완료'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
