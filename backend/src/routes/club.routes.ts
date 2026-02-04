import { Router } from 'express';
import * as clubController from '../controllers/club.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 학교 동아리 목록 조회 (인증 불필요)
router.get('/school/:schoolName', clubController.getSchoolClubs);

// 나머지는 인증 필요
router.use(authenticate);

router.post('/', clubController.createClub);
router.get('/', clubController.getClubs);
router.put('/:id', clubController.updateClub);
router.delete('/:id', clubController.deleteClub);

// 동아리 활동
router.post('/activities', clubController.createActivity);
router.get('/:clubId/activities', clubController.getActivities);
router.delete('/activities/:id', clubController.deleteActivity);

export default router;
