import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Prisma 연결 테스트
prisma.$connect()
  .then(() => console.log('✅ 데이터베이스 연결 성공'))
  .catch((error) => console.error('❌ 데이터베이스 연결 실패:', error));

export default prisma;
