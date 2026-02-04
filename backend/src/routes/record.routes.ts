import { Router } from 'express';
import * as recordController from '../controllers/record.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', recordController.createRecord);
router.get('/', recordController.getRecords);
router.get('/stats', recordController.getStats);
router.put('/:id', recordController.updateRecord);
router.delete('/:id', recordController.deleteRecord);

export default router;
