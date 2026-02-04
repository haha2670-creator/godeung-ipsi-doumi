import prisma from '../config/database';

interface CreateGradeData {
  userId: string;
  semester: string;
  subject: string;
  midterm?: number;
  final?: number;
  writtenRatio?: number;
  performance?: number;
  performanceRatio?: number;
  finalGrade?: number;
  rawScore?: number;
  memo?: string;
}

// 성적 생성
export const createGrade = async (data: CreateGradeData) => {
  return prisma.grade.create({ data });
};

// 성적 목록 조회
export const getGrades = async (userId: string) => {
  return prisma.grade.findMany({
    where: { userId },
    orderBy: [{ semester: 'asc' }, { subject: 'asc' }],
  });
};

// 학기별 성적 조회
export const getGradesBySemester = async (userId: string, semester: string) => {
  return prisma.grade.findMany({
    where: { userId, semester },
    orderBy: { subject: 'asc' },
  });
};

// 성적 수정
export const updateGrade = async (id: string, userId: string, data: Partial<CreateGradeData>) => {
  return prisma.grade.updateMany({
    where: { id, userId },
    data,
  });
};

// 성적 삭제
export const deleteGrade = async (id: string, userId: string) => {
  return prisma.grade.deleteMany({
    where: { id, userId },
  });
};

// 평균 등급 계산
export const calculateAverageGrade = async (userId: string, semester?: string) => {
  const where = semester ? { userId, semester } : { userId };
  
  const grades = await prisma.grade.findMany({
    where,
    select: { finalGrade: true },
  });

  const validGrades = grades.filter(g => g.finalGrade !== null) as { finalGrade: number }[];
  
  if (validGrades.length === 0) return null;

  const sum = validGrades.reduce((acc, g) => acc + g.finalGrade, 0);
  return (sum / validGrades.length).toFixed(2);
};
