import { Request, Response } from 'express';
import { prisma } from '../config/db';

export class UserController {
  static async getAgents(req: Request, res: Response) {
    try {
      const agents = await prisma.user.findMany({
        where: { role: 'FIELD_AGENT' },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      res.status(200).json({ success: true, message: 'Agents retrieved', data: agents });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: null });
    }
  }
}
