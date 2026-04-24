import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.middleware';

export const isRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges', data: null });
      return;
    }
    next();
  };
};

export const isAdmin = isRole(['ADMIN']);
export const isFieldAgent = isRole(['FIELD_AGENT']);
