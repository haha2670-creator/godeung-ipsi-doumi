import prisma from '../config/database';

// 학교 정보 조회
export const getSchool = async (schoolName: string) => {
  return prisma.school.findUnique({
    where: { name: schoolName },
  });
};

// 학교 목록 조회
export const getSchools = async () => {
  return prisma.school.findMany({
    select: {
      id: true,
      name: true,
      region: true,
      type: true,
    },
  });
};

// 대학 정보 조회
export const getUniversity = async (universityName: string) => {
  return prisma.university.findUnique({
    where: { name: universityName },
  });
};

// 대학 목록 조회
export const getUniversities = async () => {
  return prisma.university.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

// 대학의 학과 목록 조회
export const getUniversityMajors = async (universityName: string) => {
  const university = await prisma.university.findUnique({
    where: { name: universityName },
  });

  return university?.majors || null;
};
