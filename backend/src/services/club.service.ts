import prisma from '../config/database';

interface CreateClubData {
  userId: string;
  name: string;
  category: string;
  grade?: string;
  activity?: string;
  location?: string;
  role?: string;
  period?: string;
}

interface CreateClubActivityData {
  clubId: string;
  date: Date;
  content: string;
}

// 동아리 생성
export const createClub = async (data: CreateClubData) => {
  return prisma.club.create({ data });
};

// 동아리 목록 조회
export const getClubs = async (userId: string) => {
  return prisma.club.findMany({
    where: { userId },
    include: {
      activities: {
        orderBy: { date: 'desc' },
      },
    },
  });
};

// 동아리 수정
export const updateClub = async (id: string, userId: string, data: Partial<CreateClubData>) => {
  return prisma.club.updateMany({
    where: { id, userId },
    data,
  });
};

// 동아리 삭제
export const deleteClub = async (id: string, userId: string) => {
  return prisma.club.deleteMany({
    where: { id, userId },
  });
};

// 동아리 활동 추가
export const createClubActivity = async (data: CreateClubActivityData) => {
  return prisma.clubActivity.create({ data });
};

// 동아리 활동 조회
export const getClubActivities = async (clubId: string) => {
  return prisma.clubActivity.findMany({
    where: { clubId },
    orderBy: { date: 'desc' },
  });
};

// 동아리 활동 삭제
export const deleteClubActivity = async (id: string) => {
  return prisma.clubActivity.delete({
    where: { id },
  });
};

// 학교별 동아리 목록 조회
export const getSchoolClubs = async (schoolName: string) => {
  const school = await prisma.school.findUnique({
    where: { name: schoolName },
  });

  if (!school || !school.clubs) {
    return [];
  }

  return school.clubs;
};
