import { Router } from 'express';
import * as gradeController from '../controllers/grade.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate as any);

router.post('/', gradeController.createGrade as any);
router.get('/', gradeController.getGrades as any);
router.get('/average', gradeController.getAverageGrade as any);
router.put('/:id', gradeController.updateGrade as any);
router.delete('/:id', gradeController.deleteGrade as any);

export default router;
