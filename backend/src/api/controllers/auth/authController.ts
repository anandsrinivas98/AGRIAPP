import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../../../config';
import { AuthRequest } from '../../../shared/types/auth';

const prisma = new PrismaClient();

// This file is deprecated - use src/api/v1/auth/controller.ts instead
// Keeping for backward compatibility

export const register = async (req: Request, res: Response): Promise<void> => {
  res.status(410).json({
    error: 'This endpoint is deprecated. Please use /api/v1/auth/register',
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  res.status(410).json({
    error: 'This endpoint is deprecated. Please use /api/v1/auth/login',
  });
};
