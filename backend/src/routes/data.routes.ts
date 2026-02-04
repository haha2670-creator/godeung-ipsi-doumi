import { Router } from 'express';
import * as dataController from '../controllers/data.controller';

const router = Router();

// 학교 정보
router.get('/schools', dataController.getSchools as any);
router.get('/schools/:name', dataController.getSchool as any);

// 대학 정보
router.get('/universities', dataController.getUniversities as any);
router.get('/universities/:name', dataController.getUniversity as any);
router.get('/universities/:name/majors', dataController.getUniversityMajors as any);

// 공공데이터 API 연동 (대학알리미)
router.get('/public/status', dataController.getPublicDataStatus as any);
router.get('/public/universities/:name/stats', dataController.getUniversityStatsFromPublic as any);

export default router;
