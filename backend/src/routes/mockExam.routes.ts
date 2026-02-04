import { Router } from 'express';
import * as mockExamController from '../controllers/mockExam.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', mockExamController.createMockExam);
router.get('/', mockExamController.getMockExams);
router.get('/trend', mockExamController.getTrend);
router.put('/:id', mockExamController.updateMockExam);
router.delete('/:id', mockExamController.deleteMockExam);

export default router;
