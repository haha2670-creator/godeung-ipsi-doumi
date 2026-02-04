import { Router } from 'express';
import authRoutes from './auth.routes';
import aiRoutes from './ai.routes';
import gradeRoutes from './grade.routes';
import mockExamRoutes from './mockExam.routes';
import recordRoutes from './record.routes';
import goalRoutes from './goal.routes';
import scheduleRoutes from './schedule.routes';
import academyRoutes from './academy.routes';
import clubRoutes from './club.routes';
import dataRoutes from './data.routes';
import subjectsRoutes from './subjects.routes';

const router = Router();

// 헬스 체크
router.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: '서버가 정상 작동 중입니다.' });
});

// 인증 관련 라우트
router.use('/auth', authRoutes);

// AI 관련 라우트
router.use('/ai', aiRoutes);

// 성적 관리
router.use('/grades', gradeRoutes);

// 모의고사
router.use('/mock-exams', mockExamRoutes);

// 생기부
router.use('/records', recordRoutes);

// 목표 대학
router.use('/goals', goalRoutes);

// 일정 관리
router.use('/schedules', scheduleRoutes);

// 학원 스케줄
router.use('/academy', academyRoutes);

// 동아리
router.use('/clubs', clubRoutes);

// 기초 데이터 (학교, 대학)
router.use('/data', dataRoutes);

// 선택과목
router.use('/subjects', subjectsRoutes);

export default router;
