import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY가 설정되지 않았습니다.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface GenerateSetechRequest {
  category: string;  // 세특, 독서, 수상, 봉사, 동아리
  title: string;
  content: string;
  grade?: string;
  subject?: string;
}

/**
 * AI 세특 초안 생성
 */
export const generateSetech = async (data: GenerateSetechRequest): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
당신은 대한민국 고등학교 생활기록부 작성 전문가입니다.
학생의 활동 내용을 바탕으로 전문적이고 구체적인 세부능력 및 특기사항(세특)을 작성해주세요.

[작성 가이드라인]
1. 학생의 활동을 구체적으로 서술
2. 성장 과정과 배운 점을 명확히 기술
3. 교과 역량과 연결
4. 평가적 표현보다는 서술적 표현 사용
5. 반드시 500자 이내로 작성 (생활기록부 NEIS 과목별 세특 글자수 제한 준수)
6. 존댓말 사용 금지 (학생 이름 대신 "학생은", "해당 학생은" 등으로 표현)

[학생 활동 정보]
카테고리: ${data.category}
제목: ${data.title}
${data.subject ? `과목: ${data.subject}` : ''}
${data.grade ? `학년: ${data.grade}` : ''}

활동 내용:
${data.content}

위 내용을 바탕으로 생활기록부 세특을 작성해주세요.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ AI 세특 생성 완료');
    return text;
  } catch (error) {
    console.error('❌ AI 세특 생성 실패:', error);
    throw new Error('AI 세특 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
};

/**
 * AI 자기소개서 작성 지원
 */
export const generatePersonalStatement = async (
  prompt: string,
  activities: string[]
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const fullPrompt = `
당신은 대학 입시 자기소개서 작성 전문가입니다.

[자기소개서 문항]
${prompt}

[학생의 주요 활동]
${activities.join('\n')}

위 활동들을 바탕으로 자기소개서 초안을 작성해주세요.
- 구체적인 경험과 배운 점을 중심으로 서술
- 진솔하고 개성있는 표현 사용
- 500~700자 내외로 작성
`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('❌ 자기소개서 생성 실패:', error);
    throw new Error('자기소개서 생성에 실패했습니다.');
  }
};

/**
 * AI 면접 예상 질문 생성
 */
export const generateInterviewQuestions = async (
  university: string,
  major: string,
  activities: string[]
): Promise<string[]> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
당신은 대학 입시 면접 전문가입니다.

[지원 정보]
대학: ${university}
학과: ${major}

[학생의 주요 활동]
${activities.join('\n')}

위 정보를 바탕으로 면접에서 나올 수 있는 예상 질문 10개를 생성해주세요.
각 질문은 한 줄로 작성하고, 번호를 붙여주세요.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 질문을 배열로 변환
    const questions = text
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
    
    return questions;
  } catch (error) {
    console.error('❌ 면접 질문 생성 실패:', error);
    throw new Error('면접 질문 생성에 실패했습니다.');
  }
};

/**
 * AI 학습 계획 추천
 */
export const generateStudyPlan = async (
  grade: string,
  targetUniversity: string,
  targetMajor: string,
  currentGrades: any[]
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
당신은 고등학생 학습 계획 전문가입니다.

[학생 정보]
학년: ${grade}
목표 대학: ${targetUniversity}
목표 학과: ${targetMajor}

[현재 성적]
${JSON.stringify(currentGrades, null, 2)}

위 정보를 바탕으로 학생에게 맞춤형 학습 계획을 추천해주세요.
- 학년별 목표
- 과목별 학습 전략
- 비교과 활동 추천
- 시간 관리 팁
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('❌ 학습 계획 생성 실패:', error);
    throw new Error('학습 계획 생성에 실패했습니다.');
  }
};

/**
 * 합격 가능성 분석 (AI 기반)
 */
export const analyzeAdmissionChance = async (
  targetUniversity: string,
  targetMajor: string,
  admissionType: string,
  studentProfile: any
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
당신은 대학 입시 전문 컨설턴트입니다.

[지원 정보]
대학: ${targetUniversity}
학과: ${targetMajor}
전형: ${admissionType}

[학생 프로필]
${JSON.stringify(studentProfile, null, 2)}

위 정보를 바탕으로 합격 가능성을 분석하고, 개선 방안을 제시해주세요.
- 합격 가능성 평가
- 강점 분석
- 보완할 점
- 구체적인 개선 방안
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('❌ 합격 가능성 분석 실패:', error);
    throw new Error('합격 가능성 분석에 실패했습니다.');
  }
};
