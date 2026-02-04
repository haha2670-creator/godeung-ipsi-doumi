import { Router } from 'express';
import * as goalController from '../controllers/goal.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate as any);

router.post('/', goalController.createGoal as any);
router.get('/', goalController.getGoals as any);
router.get('/:id/roadmap', goalController.getRoadmap as any);
router.put('/:id', goalController.updateGoal as any);
router.delete('/:id', goalController.deleteGoal as any);

export default router;
