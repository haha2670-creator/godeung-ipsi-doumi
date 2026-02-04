import { Router } from 'express';
import * as scheduleController from '../controllers/schedule.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', scheduleController.createSchedule);
router.get('/', scheduleController.getSchedules);
router.get('/upcoming', scheduleController.getUpcoming);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

export default router;
