import prisma from '../config/database';

interface CreateScheduleData {
  userId: string;
  type: string;
  subject: string;
  name: string;
  date: Date;
  memo?: string;
}

// 일정 생성
export const createSchedule = async (data: CreateScheduleData) => {
  return prisma.schedule.create({ data });
};

// 일정 목록 조회
export const getSchedules = async (userId: string, type?: string) => {
  const where = type ? { userId, type } : { userId };
  
  return prisma.schedule.findMany({
    where,
    orderBy: { date: 'asc' },
  });
};

// 월별 일정 조회
export const getSchedulesByMonth = async (userId: string, year: number, month: number) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return prisma.schedule.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'asc' },
  });
};

// 일정 수정
export const updateSchedule = async (id: string, userId: string, data: Partial<CreateScheduleData>) => {
  return prisma.schedule.updateMany({
    where: { id, userId },
    data,
  });
};

// 일정 삭제
export const deleteSchedule = async (id: string, userId: string) => {
  return prisma.schedule.deleteMany({
    where: { id, userId },
  });
};

// D-Day 계산
export const getUpcomingSchedules = async (userId: string, days: number = 30) => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  const schedules = await prisma.schedule.findMany({
    where: {
      userId,
      date: {
        gte: today,
        lte: futureDate,
      },
    },
    orderBy: { date: 'asc' },
  });

  return schedules.map(schedule => {
    const dDay = Math.ceil((schedule.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      ...schedule,
      dDay: dDay === 0 ? 'D-Day' : `D-${dDay}`,
    };
  });
};
