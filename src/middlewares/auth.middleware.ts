import { Request, Response, NextFunction } from 'express';

export function verifyAuth(req: Request, res: Response, next: NextFunction): any {
  const authHeader = req.headers['authorization'];

  if (authHeader !== `Bearer ${process.env.SERVICE_ACCOUNT_EMAIL}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
}
