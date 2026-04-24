import { Router } from 'express';
import { FieldController } from '../controllers/field.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin, isFieldAgent } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createFieldSchema, updateFieldSchema } from '../schemas/field.schema';

const router = Router();

// Admin Only
router.post('/', authenticate, isAdmin, validate(createFieldSchema), FieldController.createField);
router.put('/:id', authenticate, isAdmin, validate(updateFieldSchema), FieldController.updateField);
router.get('/', authenticate, isAdmin, FieldController.getAllFields);

// Field Agent Only
router.get('/assigned', authenticate, isFieldAgent, FieldController.getAssignedFields);

export default router;
