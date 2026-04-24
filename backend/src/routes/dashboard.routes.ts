import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin, isFieldAgent } from '../middlewares/role.middleware';

const router = Router();

router.get('/admin', authenticate, isAdmin, DashboardController.getAdminDashboard);
router.get('/agent', authenticate, isFieldAgent, DashboardController.getAgentDashboard);

export default router;
