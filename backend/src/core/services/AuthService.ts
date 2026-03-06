import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../../utils/otpGenerator';
import { emailService } from '../../utils/emailService';

const prisma = new PrismaClient();

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'FARMER' | 'AGRONOMIST' | 'ADMIN';
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    verified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthService {
  async register(data: RegisterData): Promise<{ message: string }> {
    const { email, password, firstName, lastName, phone, role = 'FARMER' } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Check if there's a pending registration
    const existingPending = await prisma.pendingUser.findUnique({ where: { email } });
    if (existingPending) {
      // Delete existing pending registration
      await prisma.pendingUser.delete({ where: { email } });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create pending user
    await prisma.pendingUser.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role,
        verificationOtp: otp,
        verificationOtpExpiry: otpExpiry,
      },
    });

    // Send verification email
    await emailService.sendVerificationOTP(email, otp, firstName);

    return { message: 'Registration successful. Please check your email for verification code.' };
  }

  async verifyEmail(email: string, otp: string): Promise<LoginResponse> {
    const pendingUser = await prisma.pendingUser.findUnique({ where: { email } });

    if (!pendingUser) {
      throw new Error('No pending registration found for this email');
    }

    if (pendingUser.verificationOtp !== otp) {
      throw new Error('Invalid verification code');
    }

    if (new Date() > pendingUser.verificationOtpExpiry) {
      throw new Error('Verification code has expired');
    }

    // Create verified user
    const user = await prisma.user.create({
      data: {
        email: pendingUser.email,
        password: pendingUser.password,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        phone: pendingUser.phone,
        role: pendingUser.role,
        verified: true,
      },
    });

    // Delete pending user
    await prisma.pendingUser.delete({ where: { email } });

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
      },
      tokens,
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    if (!user.verified) {
      throw new Error('Please verify your email before logging in');
    }

    const tokens = this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
      },
      tokens,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = jwt.sign(
      { userId: user.id, type: 'password-reset' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    await emailService.sendPasswordResetEmail(email, resetToken, user.firstName);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      if (decoded.type !== 'password-reset') {
        throw new Error('Invalid token type');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.resetToken !== token || !user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
        throw new Error('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens(user.id);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  private generateTokens(userId: string): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}