import { Survey, SurveyResponse, QuestionStat, StatMetrics, OverallSatisfactionBreakdown } from '../types/survey';

export const LIKERT_LABELS: Record<number, string> = {
  1: '매우 불만족',
  2: '불만족',
  3: '보통',
  4: '만족',
  5: '매우 만족'
};

export const CATEGORY_LABELS: Record<string, string> = {
  program_awareness: '프로그램 인지도',
  teacher_communication: '소통과 유대감',
  class_participation: '자아존중과 긍정적 태도',
  peer_relationship: '배려와 공동체 문화',
  overall_satisfaction: '전반적 만족도',
  program_benefit: '프로그램 유익성',
  custom: '기타 문항'
};

export function calculateStats(values: number[]): StatMetrics {
  if (values.length === 0) {
    return { mean: 0, median: 0, mode: [], modeLabel: '-' };
  }

  // Mean (평균)
  const sum = values.reduce((acc, v) => acc + v, 0);
  const mean = Number((sum / values.length).toFixed(2));

  // Median (중앙값)
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0
    ? sorted[mid]
    : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1));

  // Mode (최빈값)
  const counts: Record<number, number> = {};
  let maxCount = 0;
  values.forEach(v => {
    counts[v] = (counts[v] || 0) + 1;
    if (counts[v] > maxCount) maxCount = counts[v];
  });

  const mode = Object.keys(counts)
    .map(Number)
    .filter(k => counts[k] === maxCount)
    .sort((a, b) => b - a);

  const modeLabel = mode.map(m => `${m}점 (${LIKERT_LABELS[m] || ''})`).join(', ');

  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
  const standardDeviation = Number(Math.sqrt(variance).toFixed(2));

  return {
    mean,
    median,
    mode,
    modeLabel,
    standardDeviation
  };
}

export interface AnalyticsSummary {
  totalResponses: number;
  targetCount: number;
  responseRate: number;
  overallStats: StatMetrics;
  positivePercentage: number;
  overallSatisfactionBreakdown: OverallSatisfactionBreakdown;
  questionStats: QuestionStat[];
  highestRatedQuestion: QuestionStat | null;
  lowestRatedQuestion: QuestionStat | null;
  gradeDistribution: {
    grade1: number;
    grade2: number;
    grade3: number;
  };
  recommendations: {
    strength: string;
    improvement: string;
    actionItems: string[];
  };
}

export function calculateAnalytics(
  survey: Survey,
  responses: SurveyResponse[],
  filters?: {
    grade?: 'all' | 1 | 2 | 3;
    respondentType?: 'all' | 'student' | 'parent';
  }
): AnalyticsSummary {
  const filtered = responses.filter(r => {
    if (filters?.grade && filters.grade !== 'all' && r.grade !== filters.grade) {
      return false;
    }
    if (filters?.respondentType && filters.respondentType !== 'all' && r.respondentType !== filters.respondentType) {
      return false;
    }
    return true;
  });

  const total = filtered.length;

  if (total === 0) {
    return {
      totalResponses: 0,
      targetCount: survey.targetCount,
      responseRate: 0,
      overallStats: { mean: 0, median: 0, mode: [], modeLabel: '-' },
      positivePercentage: 0,
      overallSatisfactionBreakdown: {
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        stats: { mean: 0, median: 0, mode: [], modeLabel: '-' }
      },
      questionStats: [],
      highestRatedQuestion: null,
      lowestRatedQuestion: null,
      gradeDistribution: { grade1: 0, grade2: 0, grade3: 0 },
      recommendations: {
        strength: '응답 데이터가 없습니다.',
        improvement: '설문을 배포하여 응답을 수집해 주세요.',
        actionItems: []
      }
    };
  }

  const gradeDistribution = {
    grade1: filtered.filter(r => r.grade === 1).length,
    grade2: filtered.filter(r => r.grade === 2).length,
    grade3: filtered.filter(r => r.grade === 3).length
  };

  const allLikertValues: number[] = [];

  const questionStats: QuestionStat[] = survey.questions.map(q => {
    const values: number[] = [];
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    filtered.forEach(r => {
      const val = Number(r.answers[q.id]);
      if (val >= 1 && val <= 5) {
        values.push(val);
        distribution[val] = (distribution[val] || 0) + 1;
        allLikertValues.push(val);
      }
    });

    const stats = calculateStats(values);
    const positiveCount = (distribution[4] || 0) + (distribution[5] || 0);
    const positivePercentage = values.length > 0
      ? Number(((positiveCount / values.length) * 100).toFixed(1))
      : 0;

    const distributionPercentages: Record<number, number> = {
      1: values.length > 0 ? Number(((distribution[1] / values.length) * 100).toFixed(1)) : 0,
      2: values.length > 0 ? Number(((distribution[2] / values.length) * 100).toFixed(1)) : 0,
      3: values.length > 0 ? Number(((distribution[3] / values.length) * 100).toFixed(1)) : 0,
      4: values.length > 0 ? Number(((distribution[4] / values.length) * 100).toFixed(1)) : 0,
      5: values.length > 0 ? Number(((distribution[5] / values.length) * 100).toFixed(1)) : 0
    };

    return {
      questionId: q.id,
      questionText: q.text,
      category: q.category,
      categoryLabel: q.categoryLabel,
      type: q.type,
      stats,
      positivePercentage,
      distribution,
      distributionPercentages,
      totalAnswers: values.length
    };
  });

  const overallStats = calculateStats(allLikertValues);
  const positiveLikertCount = allLikertValues.filter(v => v >= 4).length;
  const positivePercentage = allLikertValues.length > 0
    ? Number(((positiveLikertCount / allLikertValues.length) * 100).toFixed(1))
    : 0;

  const overallDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  allLikertValues.forEach(v => {
    if (overallDist[v] !== undefined) overallDist[v]++;
  });

  const overallDistPercentages: Record<number, number> = {
    1: allLikertValues.length > 0 ? Number(((overallDist[1] / allLikertValues.length) * 100).toFixed(1)) : 0,
    2: allLikertValues.length > 0 ? Number(((overallDist[2] / allLikertValues.length) * 100).toFixed(1)) : 0,
    3: allLikertValues.length > 0 ? Number(((overallDist[3] / allLikertValues.length) * 100).toFixed(1)) : 0,
    4: allLikertValues.length > 0 ? Number(((overallDist[4] / allLikertValues.length) * 100).toFixed(1)) : 0,
    5: allLikertValues.length > 0 ? Number(((overallDist[5] / allLikertValues.length) * 100).toFixed(1)) : 0
  };

  const overallSatisfactionBreakdown: OverallSatisfactionBreakdown = {
    distribution: overallDist,
    percentages: overallDistPercentages,
    stats: overallStats
  };

  const sortedLikert = [...questionStats].sort((a, b) => (b.stats?.mean || 0) - (a.stats?.mean || 0));
  const highestRatedQuestion = sortedLikert.length > 0 ? sortedLikert[0] : null;
  const lowestRatedQuestion = sortedLikert.length > 1 ? sortedLikert[sortedLikert.length - 1] : null;

  const recommendations = {
    strength: highestRatedQuestion
      ? `'${highestRatedQuestion.categoryLabel || highestRatedQuestion.questionText}' 문항이 평균 ${highestRatedQuestion.stats?.mean}점 (최빈값: ${highestRatedQuestion.stats?.modeLabel})으로 가장 높은 만족도와 긍정적 공감을 얻었습니다.`
      : '전반적인 만족도 지표가 매우 우수하게 집계되었습니다.',
    improvement: lowestRatedQuestion
      ? `'${lowestRatedQuestion.categoryLabel || lowestRatedQuestion.questionText}' 문항 또한 평균 ${lowestRatedQuestion.stats?.mean}점으로 높은 수준이나, 학년별 체감도를 더욱 고르게 높일 수 있는 보완 방안을 마련할 수 있습니다.`
      : '긍정적인 학교 문화를 지속적으로 유지 발전시켜 나갈 수 있습니다.',
    actionItems: [
      '학교 전반의 따뜻한 소통 분위기와 상호 배려 문화가 높은 만족도를 기록하고 있어 현재의 인성 실천 방향성 지속 유지',
      '1, 2, 3학년 모든 학년이 자연스럽게 어울리고 공감할 수 있는 포괄적 공동체 활동 기회 확대',
      '학부모회와 학교가 긴밀히 협력하여 가정과 학교가 함께하는 따뜻한 응원 문화 조성',
      '학생들이 자아존중감과 심리적 안정감을 느낄 수 있는 일상 속 긍정 대화 환경 지속 제공'
    ]
  };

  return {
    totalResponses: total,
    targetCount: survey.targetCount,
    responseRate: Number(((total / survey.targetCount) * 100).toFixed(1)),
    overallStats,
    positivePercentage,
    overallSatisfactionBreakdown,
    questionStats,
    highestRatedQuestion,
    lowestRatedQuestion,
    gradeDistribution,
    recommendations
  };
}

export function exportSurveyToCSV(
  survey: Survey,
  responses: SurveyResponse[],
  targetLabel: '전체' | '학생' | '학부모' = '전체'
): void {
  const headers = [
    '응답번호',
    '구분',
    '제출일시',
    '학년',
    ...survey.questions.map((q, idx) => `문항${idx + 1}_[${q.categoryLabel || ''}] ${q.text.replace(/,/g, ' ')}`)
  ];

  const rows = responses.map((r, i) => {
    return [
      `No.${i + 1}`,
      r.respondentType === 'parent' ? '학부모' : '학생',
      r.submittedAt,
      `${r.grade}학년`,
      ...survey.questions.map(q => {
        const val = r.answers[q.id];
        if (val === undefined || val === null) return '';
        if (typeof val === 'number' && LIKERT_LABELS[val]) {
          return `"${val}점 (${LIKERT_LABELS[val]})"`;
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      })
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${survey.schoolName}_${targetLabel}_인성만족도결과_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
