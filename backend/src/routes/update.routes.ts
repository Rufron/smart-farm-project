import { Router } from 'express';
import { UpdateController } from '../controllers/update.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin, isFieldAgent } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createUpdateSchema } from '../schemas/update.schema';

const router = Router();

// Agent Only
router.post('/fields/:id/update', authenticate, isFieldAgent, validate(createUpdateSchema), UpdateController.addUpdate);

// Admin Only
router.get('/updates', authenticate, isAdmin, UpdateController.getAllUpdates);

export default router;
