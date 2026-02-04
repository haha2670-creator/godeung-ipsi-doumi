import prisma from '../config/database';

const DAY_ORDER: Record<string, number> = {
  '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 7,
};

interface CreateAcademyScheduleData {
  userId: string;
  academyName: string;
  subject: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

// 학원 스케줄 생성
export const createAcademySchedule = async (data: CreateAcademyScheduleData) => {
  return prisma.academySchedule.create({ data });
};

// 학원 스케줄 목록 조회 (요일순, 시간순 정렬)
export const getAcademySchedules = async (userId: string) => {
  const schedules = await prisma.academySchedule.findMany({
    where: { userId },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });
  return schedules.sort((a, b) => {
    const orderA = DAY_ORDER[a.dayOfWeek] ?? 99;
    const orderB = DAY_ORDER[b.dayOfWeek] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.startTime.localeCompare(b.startTime);
  });
};

// 학원 스케줄 수정
export const updateAcademySchedule = async (
  id: string,
  userId: string,
  data: Partial<Omit<CreateAcademyScheduleData, 'userId'>>
) => {
  return prisma.academySchedule.updateMany({
    where: { id, userId },
    data,
  });
};

// 학원 스케줄 삭제
export const deleteAcademySchedule = async (id: string, userId: string) => {
  return prisma.academySchedule.deleteMany({
    where: { id, userId },
  });
};
