import { Request, Response } from 'express';
import { FieldService } from '../services/field.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class FieldController {
  static async createField(req: AuthRequest, res: Response) {
    try {
      const field = await FieldService.createField(req.user!.id, req.body);
      res.status(201).json({ success: true, message: 'Field created successfully', data: field });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message, data: null });
    }
  }

  static async updateField(req: Request, res: Response) {
    try {
      const field = await FieldService.updateField(req.params.id as string, req.body);
      res.status(200).json({ success: true, message: 'Field updated successfully', data: field });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message, data: null });
    }
  }

  static async getAllFields(req: Request, res: Response) {
    try {
      const fields = await FieldService.getAllFields();
      res.status(200).json({ success: true, message: 'Fields retrieved', data: fields });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: null });
    }
  }

  static async getAssignedFields(req: AuthRequest, res: Response) {
    try {
      const fields = await FieldService.getAssignedFields(req.user!.id);
      res.status(200).json({ success: true, message: 'Assigned fields retrieved', data: fields });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: null });
    }
  }
}
