import prisma from '../config/database';

interface CreateGoalData {
  userId: string;
  rank: number;
  university: string;
  major: string;
  admissionType: string;
}

// 목표 대학 생성
export const createGoal = async (data: CreateGoalData) => {
  return prisma.goal.create({ data });
};

// 목표 대학 목록 조회
export const getGoals = async (userId: string) => {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { rank: 'asc' },
  });
};

// 목표 대학 수정
export const updateGoal = async (id: string, userId: string, data: Partial<CreateGoalData>) => {
  return prisma.goal.updateMany({
    where: { id, userId },
    data,
  });
};

// 목표 대학 삭제
export const deleteGoal = async (id: string, userId: string) => {
  return prisma.goal.deleteMany({
    where: { id, userId },
  });
};

// 2028학년도 대입 기준 일정 (대교협 확정 일정 반영)
const KEY_DATES_2028 = [
  { label: '수시 모집 원서접수', date: '2027년 9월 20일 ~ 9월 23일', note: '대학별 4일간' },
  { label: '수시 면접·실기', date: '2027년 10월 ~ 11월', note: '대학·전형별 상이' },
  { label: '8월 대학수학능력시험 모의평가', date: '2027년 8월 말 (예정)', note: '2028학년도부터 9월→8월 시행' },
  { label: '2028학년도 수능', date: '2027년 11월 18일', note: '실제 시험일은 연도별 공지 확인' },
  { label: '수능 성적 통지', date: '2027년 12월 10일', note: '수시 합격자 발표 후' },
  { label: '수시 합격자 발표', date: '2028년 2월 초', note: '대학별 공지' },
  { label: '정시 모집 원서접수', date: '2028년 1월 3일 ~ 1월 6일', note: '가·나·다군 각 8일' },
  { label: '정시 합격자 발표', date: '2028년 2월', note: '군별 순차 발표' },
];

// 학과 계열별 추가 포인트 (로드맵 태스크 보강용)
const getMajorHints = (major: string): string[] => {
  if (/공학|기계|전자|컴퓨터|소프트웨어|정보|전기|화학공학|건축/.test(major)) {
    return ['수학·과학(물리/화학) 세특을 과목별로 꼼꼼히', '탐구·발명·프로젝트 활동 기록'];
  }
  if (/의학|의예|치의|한의|약학|간호|수의|생명|생물|화학/.test(major)) {
    return ['생명과학·화학 실험·탐구 활동 강조', '의료·보건 봉사 또는 진로 체험'];
  }
  if (/경영|경제|금융|회계/.test(major)) {
    return ['경제·통계 관련 독서·대회', '경제글쓰기·토론 동아리'];
  }
  if (/인문|국어|영어|사학|철학|문학/.test(major)) {
    return ['독서·글쓰기·토론 활동', '교과 연계 심화 탐구'];
  }
  return [];
};

// 로드맵 생성
export const generateRoadmap = async (userId: string, goalId: string) => {
  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
  });

  if (!goal) {
    throw new Error('목표를 찾을 수 없습니다.');
  }

  const majorHints = getMajorHints(goal.major);

  // 전형별 구체 로드맵 (2028학년도 대입·고교학점제 기준)
  const roadmapTemplates: Record<string, any> = {
    '학생부종합': {
      title: `${goal.university} ${goal.major} 학생부종합 맞춤 로드맵`,
      targetYear: '2028학년도 대입',
      keyDates: KEY_DATES_2028,
      majorHints: majorHints.length > 0 ? majorHints : null,
      milestones: [
        {
          semester: '고1-1 (2025.3~7)',
          tasks: [
            '교과 성적: 전 과목 5등급(A~E) 이상 유지, 특히 국·영·수·탐 기본기 확보',
            '진로·전공 관련 독서 분기당 3권 이상 (독서기록 작성)',
            '동아리 1개 가입 후 활동 내용·역할 구체적으로 기록',
            '1학기 중 교과 세특용으로 수업 참여·과제·발표 사례 메모해 두기',
          ],
        },
        {
          semester: '고1-2 (2025.9~12)',
          tasks: [
            '생기부 세특: 과목별 500자 이내, 성장·탐구 과정이 드러나도록 1차 작성',
            '교내 대회(과학탐구·글쓰기·토론 등) 1회 이상 참가·수상 목표',
            '봉사활동 1학기 10시간 이상, 활동 내용 구체 기록',
            '2학기 말까지 진로·전공 관련 독서 누적 10권 이상',
          ],
        },
        {
          semester: '고2-1 (2026.3~7)',
          tasks: [
            '선택과목: 지원 대학·학과 요강에 맞춰 전략적 선택 (미적분·과탐 등)',
            '전공 관련 심화 활동(탐구보고서·프로젝트·동아리)으로 세특 2차 보강',
            '자율활동·진로활동 500자·700자 분량으로 구체적 성과 정리',
            '목표 대학 2026년 전형계획(모집요강) 3~4월 공개 시 반드시 확인',
          ],
        },
        {
          semester: '고2-2 (2026.9~12)',
          tasks: [
            '자기소개서 1~2번 문항 초안 작성, 활동과 연계한 스토리 구성',
            '면접 예상 질문 리스트 작성·답변 초안 (전공·활동·진로)',
            '교내·교외 수상·자격증 정리 (생기부 기재용)',
            '8월 모의평가(2028학년도부터 8월 시행) 응시·성적 분석',
          ],
        },
        {
          semester: '고3-1 (2027.3~7)',
          tasks: [
            '자기소개서 최종안 완성, 대학별·전형별 문항 맞춤 수정',
            '교사 추천서 요청·제출 일정 확인 (대학별 상이)',
            '생기부 최종 점검: 오타·과목별 세특 글자수(500자)·일관성 확인',
            '수시 지원 가능 대학·전형 목록 작성, 9월 원서 전 전략 확정',
          ],
        },
        {
          semester: '고3-2 (2027.9~12)',
          tasks: [
            '수시 원서접수: 2027.9.20~23 (4일), 지원 서류·성적·자소서 최종 제출',
            '면접·실기: 10~11월, 대학별 일정에 맞춰 준비·참여',
            '수능 준비(수시 불합격 대비): 11월 18일 수능 대비 기출·실전 연습',
            '수능 성적통지(12.10) 후 정시 지원 가능 대학·군별 전략 수립',
          ],
        },
      ],
    },
    '학생부교과': {
      title: `${goal.university} ${goal.major} 학생부교과 맞춤 로드맵`,
      targetYear: '2028학년도 대입',
      keyDates: KEY_DATES_2028,
      majorHints: majorHints.length > 0 ? majorHints : null,
      milestones: [
        {
          semester: '고1-1 (2025.3~7)',
          tasks: [
            '내신: 전 과목 A·B 비율 최대화 목표 (고교학점제 5등급 기준)',
            '국·영·수·탐 균형 유지, 한 과목이라도 C 이하 방지',
            '수행평가 비중 확인 후 실험·발표·과제 만점에 가깝게 준비',
          ],
        },
        {
          semester: '고1-2 (2025.9~12)',
          tasks: [
            '1·2학기 합산 성적이 목표 대학 교과 반영비에 유리하도록 유지',
            '수행평가 기한·평가 방식 정리 후 스케줄에 반영',
            '약점 과목 보강 (과목별 세특 500자도 교과 역량 드러나게 작성)',
          ],
        },
        {
          semester: '고2-1 (2026.3~7)',
          tasks: [
            '선택과목: 지원 학과 필수·권장 과목 확인 후 이수 (미적분·과탐 등)',
            '주요 과목(국·영·수·과탐) A 등급 유지 목표',
            '2026년 모집요강 공개 시 교과 반영과목·산식·최저 확인',
          ],
        },
        {
          semester: '고2-2 (2026.9~12)',
          tasks: [
            '내신 3개년(고1·2) 성적표로 지원 가능 대학·전형 시뮬레이션',
            '면접 실시 전형이면 2학기 중 면접 예상 질문·답변 준비',
            '8월 모의평가 응시 (수능 최저 있는 전형이면 최저 충족 가능성 점검)',
          ],
        },
        {
          semester: '고3-1 (2027.3~7)',
          tasks: [
            '고3 1학기 내신이 반영비가 크면 1학기 성적 집중 관리',
            '최종 지원 대학·전형 목록 확정 (교과 반영비·최저·지역 맞춤)',
            '추천서·자소서 필요 전형이면 기한 전 준비 완료',
          ],
        },
        {
          semester: '고3-2 (2027.9~12)',
          tasks: [
            '수시 원서: 2027.9.20~23, 교과 성적·서류 최종 확인 후 접수',
            '면접·실기 있는 전형은 10~11월 일정에 맞춰 참여',
            '수능(11.18) 대비로 정시 백업 전략·과목별 마무리 학습',
          ],
        },
      ],
    },
    '논술': {
      title: `${goal.university} ${goal.major} 논술 전형 맞춤 로드맵`,
      targetYear: '2028학년도 대입',
      keyDates: KEY_DATES_2028,
      majorHints: majorHints.length > 0 ? majorHints : null,
      milestones: [
        {
          semester: '고1 (2025)',
          tasks: [
            '기본 내신 유지 (논술도 일부 대학에서 내신·수능최저 반영)',
            '독서 습관: 월 2권 이상, 요약·감상 정리',
            '논술 학원 또는 글쓰기 클래스 시작해 논리·구조 훈련',
          ],
        },
        {
          semester: '고2-1 (2026.3~7)',
          tasks: [
            '목표 대학 논술 기출 3개년 이상 분석 (유형·제시문 길이·문항 수)',
            '글쓰기 연습 주 2회 이상, 제한시간 내 개요·본론 작성',
            '인문·사회·자연 제시문에 대비한 배경지식(교과·독서) 쌓기',
          ],
        },
        {
          semester: '고2-2 (2026.9~12)',
          tasks: [
            '대학별 논술 유형(인문·사회·자연·수리) 파악 후 유형별 연습',
            '모의논술·모의고사 2회 이상 응시해 시간 배분·채점 기준 체감',
            '8월 모의평가 응시 (수능최저 대비)',
          ],
        },
        {
          semester: '고3-1 (2027.3~7)',
          tasks: [
            '실전 논술 연습: 2026·2027 기출로 시간 제한 두고 풀기',
            '첨삭 2주에 1회 이상, 피드백 반영해 재작성',
            '제시문 독해 속도·요약·논증 구조 훈련',
          ],
        },
        {
          semester: '고3-2 (2027.9~12)',
          tasks: [
            '수시 원서 9.20~23, 논술 일정·장소·준비물 확인',
            '대학별 논술 고사일 전 마지막 기출 복습·체력 관리',
            '수능(11.18) 백업을 위해 정시 과목 기본기 유지',
          ],
        },
      ],
    },
    '정시': {
      title: `${goal.university} ${goal.major} 정시 전형 맞춤 로드맵`,
      targetYear: '2028학년도 대입',
      keyDates: KEY_DATES_2028,
      majorHints: majorHints.length > 0 ? majorHints : null,
      milestones: [
        {
          semester: '고1-1 (2025.3~7)',
          tasks: [
            '수능 국·영·수 기초 개념 완성, 고1 범위 내 기출 1회 이상 풀기',
            '영어: 어휘·독해 훈련 시작, 주 3회 이상 지문 독해',
            '수학: 수Ⅰ·수Ⅱ 개념 정리 후 기본 문제 반복',
          ],
        },
        {
          semester: '고1-2 (2025.9~12)',
          tasks: [
            '탐구(사회·과학) 1·2과목 선택 방향 정하고 개념 학습',
            '모의고사(6·9·11월) 응시해 등급·오답 패턴 점검',
            '국·영·수 약점 단원 표시 후 2학기 중 보강',
          ],
        },
        {
          semester: '고2-1 (2026.3~7)',
          tasks: [
            '수능 전 범위 1회 훑기, 선택과목(미적분·확통·과탐) 확정',
            '모의고사 매회 응시, 등급표로 1·2등급 목표 과목·약점 과목 구분',
            '기출 3개년 이상 반복, 오답노트 정리',
          ],
        },
        {
          semester: '고2-2 (2026.9~12)',
          tasks: [
            '선택과목 심화·기출 마무리, 1등급 목표 과목 2개 이상 확보 목표',
            '8월 모의평가(2028학년도부터 8월 시행) 응시·성적 분석',
            '시간 배분 훈련: 과목별 제한시간 내 풀기 연습',
          ],
        },
        {
          semester: '고3-1 (2027.3~7)',
          tasks: [
            '수능 파이널: 기출 5개년 2회 이상, EBS 연계 교재 정리',
            '약점 과목 집중 (등급이 낮은 1~2과목 보강)',
            '실전 감각: 주 1회 이상 모의고사 형태로 시간 재고 풀기',
          ],
        },
        {
          semester: '고3-2 (2027.9~12)',
          tasks: [
            '수능 D-day: 2027.11.18, 전날 컨디션·준비물·장소 확인',
            '수능 성적통지(12.10) 후 3개 군·대학별 점수대 분석',
            '정시 원서: 2028.1.3~6, 가·나·다군 지원 전략 확정 후 접수',
          ],
        },
      ],
    },
  };

  const base = roadmapTemplates[goal.admissionType] || roadmapTemplates['학생부종합'];
  return {
    ...base,
    university: goal.university,
    major: goal.major,
    admissionType: goal.admissionType,
  };
};
