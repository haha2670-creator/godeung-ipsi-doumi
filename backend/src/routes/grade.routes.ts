import { Router } from 'express';
import * as gradeController from '../controllers/grade.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', gradeController.createGrade);
router.get('/', gradeController.getGrades);
router.get('/average', gradeController.getAverageGrade);
router.put('/:id', gradeController.updateGrade);
router.delete('/:id', gradeController.deleteGrade);

export default router;
