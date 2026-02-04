import { Router } from 'express';
import * as subjectsController from '../controllers/subjects.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 학교별 선택과목 목록 (인증 불필요)
router.get('/school/:schoolName', subjectsController.getSchoolSubjects as any);

// 인증 필요
router.use(authenticate as any);

// 내 선택과목 조회
router.get('/', subjectsController.getSelectedSubjects as any);

// 선택과목 저장
router.post('/', subjectsController.saveSelectedSubjects as any);

export default router;
