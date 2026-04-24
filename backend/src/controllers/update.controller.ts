import { Request, Response } from 'express';
import { UpdateService } from '../services/update.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class UpdateController {
  static async addUpdate(req: AuthRequest, res: Response) {
    try {
      const { stage, notes } = req.body;
      const result = await UpdateService.addUpdate(req.params.id as string, req.user!.id, stage, notes);
      res.status(201).json({ success: true, message: 'Update added', data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message, data: null });
    }
  }

  static async getAllUpdates(req: Request, res: Response) {
    try {
      const updates = await UpdateService.getAllUpdates();
      res.status(200).json({ success: true, message: 'Updates retrieved', data: updates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: null });
    }
  }
}
