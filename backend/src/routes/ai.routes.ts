import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 모든 AI 기능은 인증 필요
router.use(authenticate as any);

// AI 세특 초안 생성
router.post('/setech', aiController.generateSetech as any);

// AI 자기소개서 작성 지원
router.post('/personal-statement', aiController.generatePersonalStatement as any);

// AI 면접 예상 질문 생성
router.post('/interview-questions', aiController.generateInterviewQuestions as any);

// AI 학습 계획 추천
router.post('/study-plan', aiController.generateStudyPlan as any);

// 합격 가능성 분석
router.post('/admission-chance', aiController.analyzeAdmissionChance as any);

export default router;
