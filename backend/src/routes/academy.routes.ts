import { Router } from 'express';
import * as academyController from '../controllers/academy.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate as any);

router.post('/', academyController.create as any);
router.get('/', academyController.list as any);
router.put('/:id', academyController.update as any);
router.delete('/:id', academyController.remove as any);

export default router;
