import { Router } from 'express';
import * as recordController from '../controllers/record.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate as any);

router.post('/', recordController.createRecord as any);
router.get('/', recordController.getRecords as any);
router.get('/stats', recordController.getStats as any);
router.put('/:id', recordController.updateRecord as any);
router.delete('/:id', recordController.deleteRecord as any);

export default router;
