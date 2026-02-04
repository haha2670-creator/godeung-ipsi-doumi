import { Router } from 'express';
import * as academyController from '../controllers/academy.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', academyController.create);
router.get('/', academyController.list);
router.put('/:id', academyController.update);
router.delete('/:id', academyController.remove);

export default router;
