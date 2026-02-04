import { Router } from 'express';
import * as clubController from '../controllers/club.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 학교 동아리 목록 조회 (인증 불필요)
router.get('/school/:schoolName', clubController.getSchoolClubs as any);

// 나머지는 인증 필요
router.use(authenticate as any);

router.post('/', clubController.createClub as any);
router.get('/', clubController.getClubs as any);
router.put('/:id', clubController.updateClub as any);
router.delete('/:id', clubController.deleteClub as any);

// 동아리 활동
router.post('/activities', clubController.createActivity as any);
router.get('/:clubId/activities', clubController.getActivities as any);
router.delete('/activities/:id', clubController.deleteActivity as any);

export default router;
