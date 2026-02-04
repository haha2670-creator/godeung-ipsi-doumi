import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 감일고등학교 동아리 데이터
const GAMIL_CLUBS = [
  { name: "글로벌리더스", category: "학술", grade: "1", activity: "글로벌 문제 해결 및 토론", location: "1-10" },
  { name: "비전", category: "학술", grade: "1", activity: "진로 탐색 및 발표", location: "1-8" },
  { name: "청람", category: "학술", grade: "1", activity: "인문학 독서 토론", location: "1-6" },
  { name: "아임파인", category: "학술", grade: "1", activity: "또래상담 및 심리 지원", location: "1-5" },
  { name: "역사나무", category: "학술", grade: "1", activity: "역사 탐구 및 답사", location: "1-4" },
  { name: "P.E.P", category: "학술", grade: "1", activity: "영어 회화 연습", location: "1-3" },
  { name: "감깔로그", category: "학술", grade: "1", activity: "창의적 글쓰기", location: "1-2" },
  { name: "엔젤", category: "봉사", grade: "1", activity: "지역사회 봉사활동", location: "1-1" },
  { name: "CSI", category: "과학", grade: "1", activity: "과학 실험 탐구", location: "2-1" },
  { name: "하이파이브", category: "학술", grade: "1", activity: "수학 탐구 활동", location: "2-2" },
  { name: "발명아이디어", category: "과학", grade: "1", activity: "발명품 제작 및 특허 출원", location: "2-3" },
  { name: "수다(數茶)", category: "학술", grade: "2,3", activity: "수학 문제 토론", location: "2-4" },
  { name: "코더스", category: "과학", grade: "2,3", activity: "코딩 및 앱 개발", location: "2-5" },
  { name: "다빈치", category: "예술", grade: "2,3", activity: "미술 작품 창작", location: "2-6" },
  { name: "감일밴드", category: "예술", grade: "2,3", activity: "밴드 합주 및 공연", location: "2-7" },
  { name: "댄싱하이", category: "예술", grade: "2,3", activity: "방송댄스 연습", location: "2-8" },
  { name: "아카펠라", category: "예술", grade: "2,3", activity: "무반주 합창", location: "2-9" },
  { name: "난타", category: "예술", grade: "2,3", activity: "타악기 공연", location: "2-10" },
  { name: "노리터", category: "예술", grade: "2,3", activity: "전통놀이 연구", location: "3-1" },
  { name: "RCY", category: "봉사", grade: "2,3", activity: "적십자 봉사활동", location: "3-2" },
  { name: "또래상담", category: "학술", grade: "2,3", activity: "학생 심리 상담", location: "3-3" },
  { name: "그린", category: "봉사", grade: "2,3", activity: "환경보호 캠페인", location: "3-4" },
  { name: "북카페", category: "학술", grade: "2,3", activity: "도서 큐레이션", location: "3-5" },
  { name: "보드게임", category: "여가", grade: "2,3", activity: "보드게임 대회", location: "3-6" },
  { name: "탁구", category: "체육", grade: "2,3", activity: "탁구 연습 및 대회", location: "3-7" },
  { name: "배드민턴", category: "체육", grade: "2,3", activity: "배드민턴 경기", location: "3-8" },
  { name: "농구", category: "체육", grade: "2,3", activity: "농구 경기", location: "3-9" },
  { name: "축구", category: "체육", grade: "2,3", activity: "축구 경기", location: "3-10" },
  { name: "배구", category: "체육", grade: "2,3", activity: "배구 경기", location: "4-1" },
  { name: "풋살", category: "체육", grade: "2,3", activity: "풋살 경기", location: "4-2" },
  { name: "경제금융", category: "학술", grade: "2,3", activity: "경제 뉴스 분석", location: "4-3" },
  { name: "비즈쿨", category: "학술", grade: "2,3", activity: "창업 아이디어 개발", location: "4-4" },
  { name: "법과정치", category: "학술", grade: "2,3", activity: "모의재판 및 토론", location: "4-5" },
  { name: "심리학", category: "학술", grade: "2,3", activity: "심리학 이론 탐구", location: "4-6" },
  { name: "사회학", category: "학술", grade: "2,3", activity: "사회 현상 분석", location: "4-7" },
  { name: "철학", category: "학술", grade: "2,3", activity: "철학적 사고 토론", location: "4-8" },
  { name: "문학", category: "학술", grade: "2,3", activity: "문학 작품 감상", location: "4-9" },
  { name: "영화", category: "예술", grade: "2,3", activity: "영화 제작 및 감상", location: "4-10" },
  { name: "사진", category: "예술", grade: "2,3", activity: "사진 촬영 및 전시", location: "5-1" },
  { name: "만화", category: "예술", grade: "2,3", activity: "웹툰 제작", location: "5-2" },
  { name: "요리", category: "생활", grade: "2,3", activity: "요리 실습", location: "5-3" },
  { name: "제과제빵", category: "생활", grade: "2,3", activity: "베이킹 실습", location: "5-4" },
  { name: "바리스타", category: "생활", grade: "2,3", activity: "커피 제조 실습", location: "5-5" },
  { name: "헤어미용", category: "생활", grade: "2,3", activity: "헤어디자인 실습", location: "5-6" },
  { name: "네일아트", category: "생활", grade: "2,3", activity: "네일아트 실습", location: "5-7" },
  { name: "메이크업", category: "생활", grade: "2,3", activity: "메이크업 실습", location: "5-8" },
  { name: "패션", category: "예술", grade: "2,3", activity: "패션 디자인", location: "5-9" },
  { name: "생명과학", category: "과학", grade: "2,3", activity: "생명과학 실험", location: "5-10" },
  { name: "화학", category: "과학", grade: "2,3", activity: "화학 실험 탐구", location: "6-1" },
  { name: "물리", category: "과학", grade: "2,3", activity: "물리 실험 연구", location: "6-2" },
  { name: "지구과학", category: "과학", grade: "2,3", activity: "천체 관측", location: "6-3" },
  { name: "환경과학", category: "과학", grade: "2,3", activity: "환경 조사 활동", location: "6-4" },
  { name: "의학", category: "과학", grade: "2,3", activity: "의학 진로 탐구", location: "6-5" },
  { name: "간호", category: "과학", grade: "2,3", activity: "간호 실습 체험", location: "6-6" },
  { name: "약학", category: "과학", grade: "2,3", activity: "약학 진로 탐색", location: "6-7" },
  { name: "치의학", category: "과학", grade: "2,3", activity: "치의학 진로 탐구", location: "6-8" },
  { name: "한의학", category: "과학", grade: "2,3", activity: "한의학 이론 학습", location: "6-9" }
];

// 주요 대학 정보
const UNIVERSITIES = [
  {
    name: "서울대학교",
    majors: {
      "공과대학": ["기계공학부", "전기정보공학부", "컴퓨터공학부", "화학생물공학부", "건설환경공학부"],
      "자연과학대학": ["수리과학부", "통계학과", "물리천문학부", "화학부", "생명과학부"],
      "경영대학": ["경영학과"],
      "인문대학": ["국어국문학과", "영어영문학과", "역사학과", "철학과"],
      "사회과학대학": ["정치외교학부", "경제학부", "사회학과", "심리학과"],
      "의과대학": ["의예과", "간호학과"],
      "법과대학": ["법학부"]
    }
  },
  {
    name: "연세대학교",
    majors: {
      "공과대학": ["기계공학부", "전기전자공학부", "컴퓨터과학과", "화공생명공학부", "건축공학과"],
      "이과대학": ["수학과", "물리학과", "화학과", "생명시스템대학"],
      "경영대학": ["경영학과"],
      "문과대학": ["국어국문학과", "영어영문학과", "사학과", "철학과"],
      "사회과학대학": ["정치외교학과", "경제학부", "사회학과", "심리학과"],
      "의과대학": ["의예과", "간호학과"],
      "법과대학": ["법학부"]
    }
  },
  {
    name: "고려대학교",
    majors: {
      "공과대학": ["기계공학부", "전기전자공학부", "컴퓨터학과", "화공생명공학과", "건축사회환경공학부"],
      "이과대학": ["수학과", "물리학과", "화학과", "생명과학부"],
      "경영대학": ["경영학과"],
      "문과대학": ["국어국문학과", "영어영문학과", "사학과", "철학과"],
      "정경대학": ["정치외교학과", "경제학과", "통계학과"],
      "의과대학": ["의예과", "간호대학"],
      "법과대학": ["법학부"]
    }
  },
  {
    name: "KAIST",
    majors: {
      "공과대학": ["기계공학과", "전기및전자공학부", "전산학부", "화학및생명화학공학과", "건설및환경공학과"],
      "자연과학대학": ["수리과학과", "물리학과", "화학과", "생명과학과"],
      "경영대학": ["경영공학부"]
    }
  },
  {
    name: "성균관대학교",
    majors: {
      "공과대학": ["기계공학부", "전자전기공학부", "컴퓨터공학과", "화학공학부", "건축토목공학부"],
      "자연과학대학": ["수학과", "물리학과", "화학과", "생명과학과"],
      "경영대학": ["경영학과"],
      "의과대학": ["의예과"]
    }
  },
  {
    name: "한양대학교",
    majors: {
      "공과대학": ["기계공학부", "전자공학부", "컴퓨터소프트웨어학부", "화학공학과", "건설환경공학과"],
      "자연과학대학": ["수학과", "물리학과", "화학과", "생명과학과"],
      "경영대학": ["경영학과"],
      "의과대학": ["의예과"]
    }
  }
];

// 감일고등학교 2025학년도 입학생 교육과정 편제표(변경후) - 2025.7.2 기준
const GAMIL_SUBJECTS = {
  "2-1": {
    "📘 공통 (필수)": ["문학(4)", "미적분Ⅰ(4)", "영어Ⅰ(4)", "스포츠생활1(2)"],
    "📗 사회탐구 (택3)": ["사회와 문화", "정치", "세계사", "윤리와 사상", "세계시민과 지리", "동아시아 역사 기행", "한국지리 탐구", "현대사회와 윤리"],
    "📗 과학탐구 (택3)": ["물리학", "화학", "생명과학", "지구과학", "역학과 에너지", "물질과 에너지", "세포와 물질대사", "지구시스템과학"],
    "📗 예술 (택1)": ["음악 연주와 창작", "미술 창작", "음악 감상과 비평", "미술과 매체"],
    "📗 제2외국어 (택1)": ["일본어", "중국어", "일본 문화", "중국 문화"],
    "📗 정보 (택1)": ["인공지능 기초", "데이터 과학"]
  },
  "2-2": {
    "📘 공통 (필수)": ["화법과 언어(4)", "미적분Ⅰ(4)", "영어Ⅱ(4)", "스포츠생활2(2)"],
    "📗 수학 (택1)": ["기하"],
    "📗 사회탐구 (택3)": ["법과 사회", "경제", "동아시아 역사 기행", "한국지리 탐구", "도시의 미래 탐구", "국제 관계의 이해", "역사로 탐구하는 현대 세계", "사회 문제 탐구"],
    "📗 과학탐구 (택3)": ["전자기와 양자", "화학반응의 세계", "생물의 유전", "행성우주과학", "융합과학 탐구"],
    "📗 예술 (택1)": ["음악 감상과 비평", "미술과 매체"],
    "📗 제2외국어 (택1)": ["일본 문화", "중국 문화"],
    "📗 교양 (택1)": ["인간과 심리", "교육의 이해", "보건", "논술"]
  },
  "3-1": {
    "📘 공통 (필수)": ["독서와 작문(4)", "확률과 통계(4)", "영어 독해와 작문(4)", "스포츠 과학(2)"],
    "📗 국어/수학 (택1)": ["언어생활 탐구", "미적분Ⅱ"],
    "📗 영어/수학 (택1)": ["문학과 영상", "경제 수학", "미디어 영어", "세계 문화와 영어", "인문학과 윤리"],
    "📗 사회탐구 (택3)": ["세계 문화와 영어", "인문학과 윤리", "여행지리", "도시의 미래 탐구", "사회문제 탐구", "윤리 문제 탐구", "역사로 탐구하는 현대 세계"],
    "📗 과학탐구 (택3)": ["전자기와 양자", "화학반응의 세계", "생물의 유전", "행성우주과학", "융합과학 탐구", "과학의 역사와 문화", "기후변화와 환경 생태"],
    "📗 교양 (택1)": ["인간과 심리", "교육의 이해", "보건", "논술"]
  },
  "3-2": {
    "📘 공통 (필수)": ["주제탐구독서(4)", "수학과제 탐구(4)", "심화 영어 독해와 작문(4)", "스포츠 문화(2)"],
    "📗 국어/수학 (택1)": ["언어생활 탐구", "미적분Ⅱ"],
    "📗 영어/수학 (택1)": ["문학과 영상", "경제 수학", "미디어 영어", "여행지리"],
    "📗 사회탐구 (택3)": ["세계 문화와 영어", "인문학과 윤리", "여행지리", "도시의 미래 탐구", "사회문제 탐구", "윤리 문제 탐구", "역사로 탐구하는 현대 세계"],
    "📗 과학탐구 (택3)": ["과학의 역사와 문화", "기후변화와 환경 생태", "융합과학 탐구"],
    "📗 교양 (택1)": ["인간과 심리", "교육의 이해", "보건", "논술"]
  }
};

async function main() {
  console.log('🌱 시드 데이터 입력 시작...');

  // 1. 학교 정보 생성
  const SCHOOLS = [
    { name: '감일고등학교', region: '경기 하남', type: '일반고', clubs: GAMIL_CLUBS, subjects: GAMIL_SUBJECTS },
    { name: '위례고등학교', region: '경기 성남', type: '일반고', clubs: [], subjects: {} },
    { name: '한빛고등학교', region: '경기', type: '일반고', clubs: [], subjects: {} },
    { name: '덕수고등학교', region: '경기', type: '일반고', clubs: [], subjects: {} },
    { name: '효성고등학교', region: '경기', type: '일반고', clubs: [], subjects: {} },
  ];

  console.log('📚 학교 정보 생성 중...');
  for (const school of SCHOOLS) {
    await prisma.school.upsert({
      where: { name: school.name },
      update: {
        region: school.region,
        type: school.type,
        clubs: school.clubs,
        subjects: school.subjects
      },
      create: {
        name: school.name,
        region: school.region,
        type: school.type,
        clubs: school.clubs,
        subjects: school.subjects
      }
    });
    console.log(`✅ ${school.name} 생성 완료`);
  }

  // 2. 대학 정보 생성
  console.log('🎓 대학 정보 생성 중...');
  for (const university of UNIVERSITIES) {
    const createdUniv = await prisma.university.upsert({
      where: { name: university.name },
      update: {},
      create: {
        name: university.name,
        majors: university.majors
      }
    });
    console.log(`✅ ${createdUniv.name} 생성 완료`);
  }

  console.log('');
  console.log('🎉 시드 데이터 입력 완료!');
  console.log('');
  console.log('📊 생성된 데이터:');
  console.log(`   - 학교: ${SCHOOLS.length}개`);
  console.log(`   - 감일고 동아리: ${GAMIL_CLUBS.length}개`);
  console.log(`   - 대학: ${UNIVERSITIES.length}개`);
  console.log('');
  console.log('🌐 Prisma Studio에서 확인: http://localhost:5555');
}

main()
  .catch((e) => {
    console.error('❌ 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
