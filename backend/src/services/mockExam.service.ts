import prisma from '../config/database';

interface CreateMockExamData {
  userId: string;
  date: Date;
  type: string;
  koreanScore?: number;
  koreanGrade: number;
  mathScore?: number;
  mathGrade: number;
  englishScore?: number;
  englishGrade: number;
}

// 모의고사 생성
export const createMockExam = async (data: CreateMockExamData) => {
  return prisma.mockExam.create({ data });
};

// 모의고사 목록 조회
export const getMockExams = async (userId: string) => {
  return prisma.mockExam.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
};

// 모의고사 수정
export const updateMockExam = async (id: string, userId: string, data: Partial<CreateMockExamData>) => {
  return prisma.mockExam.updateMany({
    where: { id, userId },
    data,
  });
};

// 모의고사 삭제
export const deleteMockExam = async (id: string, userId: string) => {
  return prisma.mockExam.deleteMany({
    where: { id, userId },
  });
};

// 성적 추이 분석
export const getMockExamTrend = async (userId: string) => {
  const exams = await prisma.mockExam.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });

  return exams.map(exam => ({
    date: exam.date,
    type: exam.type,
    korean: exam.koreanGrade,
    math: exam.mathGrade,
    english: exam.englishGrade,
  }));
};
