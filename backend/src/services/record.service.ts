import prisma from '../config/database';

interface CreateRecordData {
  userId: string;
  semester: string;
  category: string;
  title: string;
  content: string;
}

// 생기부 기록 생성
export const createRecord = async (data: CreateRecordData) => {
  return prisma.record.create({ data });
};

// 생기부 기록 목록 조회
export const getRecords = async (userId: string, category?: string) => {
  const where = category ? { userId, category } : { userId };
  
  return prisma.record.findMany({
    where,
    orderBy: [{ semester: 'desc' }, { createdAt: 'desc' }],
  });
};

// 생기부 기록 수정
export const updateRecord = async (id: string, userId: string, data: Partial<CreateRecordData>) => {
  return prisma.record.updateMany({
    where: { id, userId },
    data,
  });
};

// 생기부 기록 삭제
export const deleteRecord = async (id: string, userId: string) => {
  return prisma.record.deleteMany({
    where: { id, userId },
  });
};

// 카테고리별 통계
export const getRecordStats = async (userId: string) => {
  const records = await prisma.record.groupBy({
    by: ['category'],
    where: { userId },
    _count: true,
  });

  return records.map(r => ({
    category: r.category,
    count: r._count,
  }));
};
