import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class DashboardController {
  static async getAdminDashboard(req: Request, res: Response) {
    try {
      const dashboard = await DashboardService.getAdminDashboard();
      res.status(200).json({ success: true, message: 'Admin dashboard data', data: dashboard });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: null });
    }
  }

  static async getAgentDashboard(req: AuthRequest, res: Response) {
    try {
      const dashboard = await DashboardService.getAgentDashboard(req.user!.id);
      res.status(200).json({ success: true, message: 'Agent dashboard data', data: dashboard });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: null });
    }
  }
}
