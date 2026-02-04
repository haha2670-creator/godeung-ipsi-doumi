import prisma from '../config/database';

interface SaveSelectedSubjectsData {
  userId: string;
  grade: string;
  subjects: string[];
}

// 선택과목 저장
export const saveSelectedSubjects = async (data: SaveSelectedSubjectsData) => {
  return prisma.selectedSubject.upsert({
    where: {
      userId_grade: {
        userId: data.userId,
        grade: data.grade,
      },
    },
    update: {
      subjects: data.subjects,
    },
    create: {
      userId: data.userId,
      grade: data.grade,
      subjects: data.subjects,
    },
  });
};

// 선택과목 조회
export const getSelectedSubjects = async (userId: string) => {
  return prisma.selectedSubject.findMany({
    where: { userId },
    orderBy: { grade: 'asc' },
  });
};

// 학년별 선택과목 조회
export const getSelectedSubjectsByGrade = async (userId: string, grade: string) => {
  return prisma.selectedSubject.findUnique({
    where: {
      userId_grade: {
        userId,
        grade,
      },
    },
  });
};

// 학교별 선택과목 목록 조회
export const getSchoolSubjects = async (schoolName: string) => {
  const school = await prisma.school.findUnique({
    where: { name: schoolName },
  });

  if (!school || !school.subjects) {
    return null;
  }

  return school.subjects;
};
