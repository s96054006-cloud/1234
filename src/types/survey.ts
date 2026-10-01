export type QuestionType = 'likert' | 'single_choice' | 'multiple_choice' | 'text';

export type RequiredCategory =
  | 'program_awareness'   // 프로그램 인지도
  | 'class_participation' // 수업 참여도
  | 'peer_relationship'   // 교우 관계
  | 'teacher_communication' // 교사와의 소통
  | 'program_benefit'     // 프로그램 유익성
  | 'overall_satisfaction' // 전반적 만족도
  | 'custom';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  category?: RequiredCategory;
  categoryLabel?: string;
  required: boolean;
  options?: string[]; // for choice questions
  description?: string;
}

export interface Survey {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetAudience: 'students' | 'parents' | 'both';
  targetCount: number;
  gradeTargets?: { 1: number; 2: number; 3: number };
  startDate: string;
  endDate: string;
  status: 'active' | 'closed' | 'draft';
  programCategory: string; // e.g. "신비고 인성브랜드", "평화감수성 회복적 생활교육"
  schoolName: string;
  hostName: string; // e.g. "신일비즈니스고등학교"
  questions: Question[];
  createdAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentType: 'student' | 'parent';
  grade: 1 | 2 | 3;
  answers: Record<string, number | string | string[]>; // questionId -> answer
  submittedAt: string;
}

export interface StatMetrics {
  mean: number;     // 평균
  median: number;   // 중앙값
  mode: number[];   // 최빈값 (배열, 복수 최빈값 대응)
  modeLabel: string; // e.g. "5점 (매우 만족)"
  standardDeviation?: number;
}

export interface QuestionStat {
  questionId: string;
  questionText: string;
  category?: RequiredCategory;
  categoryLabel?: string;
  type: QuestionType;
  stats?: StatMetrics;
  positivePercentage?: number; // 4~5 rating %
  distribution?: Record<number, number>; // 1~5 counts (1: 매우 불만족, 2: 불만족, 3: 보통, 4: 만족, 5: 매우 만족)
  distributionPercentages?: Record<number, number>; // 1~5 percentages
  choiceCounts?: Record<string, number>;
  textAnswers?: string[];
  totalAnswers: number;
}

export interface OverallSatisfactionBreakdown {
  distribution: Record<number, number>; // 1: 매우 불만족 ~ 5: 매우 만족
  percentages: Record<number, number>;
  stats: StatMetrics;
}
