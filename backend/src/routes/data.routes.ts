import { Router } from 'express';
import * as dataController from '../controllers/data.controller';

const router = Router();

// 학교 정보
router.get('/schools', dataController.getSchools);
router.get('/schools/:name', dataController.getSchool);

// 대학 정보
router.get('/universities', dataController.getUniversities);
router.get('/universities/:name', dataController.getUniversity);
router.get('/universities/:name/majors', dataController.getUniversityMajors);

// 공공데이터 API 연동 (대학알리미)
router.get('/public/status', dataController.getPublicDataStatus);
router.get('/public/universities/:name/stats', dataController.getUniversityStatsFromPublic);

export default router;
