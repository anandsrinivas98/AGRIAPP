import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthRequest } from '../types/auth';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header or cookies
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        error: 'Access denied. No token provided.',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid token.',
    });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Access denied. User not authenticated.',
      });
      return;
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Access denied. Insufficient permissions.',
      });
      return;
    }

    next();
  };
};

// Export auth as an alias for authenticate for convenience
export const auth = authenticate;