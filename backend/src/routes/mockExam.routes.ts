import { Router } from 'express';
import * as mockExamController from '../controllers/mockExam.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate as any);

router.post('/', mockExamController.createMockExam as any);
router.get('/', mockExamController.getMockExams as any);
router.get('/trend', mockExamController.getTrend as any);
router.put('/:id', mockExamController.updateMockExam as any);
router.delete('/:id', mockExamController.deleteMockExam as any);

export default router;
