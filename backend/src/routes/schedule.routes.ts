import { Router } from 'express';
import * as scheduleController from '../controllers/schedule.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate as any);

router.post('/', scheduleController.createSchedule as any);
router.get('/', scheduleController.getSchedules as any);
router.get('/upcoming', scheduleController.getUpcoming as any);
router.put('/:id', scheduleController.updateSchedule as any);
router.delete('/:id', scheduleController.deleteSchedule as any);

export default router;
