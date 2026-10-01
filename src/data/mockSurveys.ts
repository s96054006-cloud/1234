import { Survey, SurveyResponse } from '../types/survey';

export const INITIAL_SURVEYS: Survey[] = [
  {
    id: 'survey-shinil-2026',
    title: '2026학년도 신일비즈니스고 인성 프로그램 만족도 조사',
    subtitle: '신비고 인성브랜드 "신비한 가치, 신비스럽게 잇다" - 인지도 및 만족도 설문',
    description: '올 한 해 본교에서 운영된 전반적인 인성 교육 및 활동에 대해 학생과 학부모님의 소중한 생각을 듣고자 합니다. 설문 결과는 더 따뜻하고 행복한 학교를 만드는 데 소중히 반영됩니다.',
    targetAudience: 'both',
    targetCount: 353,
    gradeTargets: {
      1: 125,
      2: 95,
      3: 133
    },
    startDate: '2026-05-15',
    endDate: '2026-06-05',
    status: 'active',
    programCategory: '신비고 인성브랜드 프로그램',
    schoolName: '신일비즈니스고등학교',
    hostName: '신일비즈니스고등학교',
    createdAt: '2026-05-15',
    questions: [
      {
        id: 'q1',
        category: 'program_awareness',
        categoryLabel: '프로그램 인지도',
        text: '우리 학교에서 학생들의 바른 인성과 따뜻한 학교 문화를 위해 다양한 인성 프로그램이 운영되고 있음을 알고 계십니까?',
        type: 'likert',
        required: true,
        description: '학교 인성 교육 및 실천 활동에 대한 인지 여부'
      },
      {
        id: 'q2',
        category: 'teacher_communication',
        categoryLabel: '소통과 유대감',
        text: '학교 인성 프로그램을 통해 선생님, 친구들과 더 따뜻하게 소통하고 서로를 이해하는 마음이 깊어졌습니다.',
        type: 'likert',
        required: true,
        description: '사제 간의 신뢰와 또래 간의 배려 및 공감대 형성'
      },
      {
        id: 'q3',
        category: 'class_participation',
        categoryLabel: '자아존중과 긍정적 태도',
        text: '인성 활동에 참여하면서 나 자신을 더 소중히 여기고 긍정적인 마음으로 학교생활을 하는 데 도움이 되었습니다.',
        type: 'likert',
        required: true,
        description: '자아존중감 증진 및 즐거운 학교생활 태도 함양'
      },
      {
        id: 'q4',
        category: 'peer_relationship',
        categoryLabel: '배려와 공동체 문화',
        text: '학교의 다양한 인성 교육을 통해 서로를 배려하고 존중하는 밝고 따뜻한 학교 분위기를 체감하고 있습니다.',
        type: 'likert',
        required: true,
        description: '상호 존중과 협력하는 건강한 학교 공동체 문화 체감'
      },
      {
        id: 'q5',
        category: 'overall_satisfaction',
        categoryLabel: '전반적 만족도',
        text: '올 한 해 학교에서 운영된 전반적인 인성 프로그램에 만족하며, 이러한 긍정적인 활동이 앞으로도 지속되기를 희망합니다.',
        type: 'likert',
        required: true,
        description: '2026학년도 학교 인성 프로그램 전반에 대한 종합 만족도'
      }
    ]
  }
];

// Returns an empty list of responses by default (no sample responses)
export function generateSeedResponses(surveyId: string): SurveyResponse[] {
  return [];
}
