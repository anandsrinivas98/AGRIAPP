import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { AuthRequest } from '../types/auth';
import { emailService } from '../utils/emailService';
import { 
  generateOTP, 
  generateResetToken, 
  getOTPExpiry, 
  getResetTokenExpiry, 
  isExpired 
} from '../utils/otpGenerator';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    console.log('Registration attempt:', {
      email,
      firstName,
      lastName,
      phone: phone || '(empty)',
      passwordLength: password?.length || 0
    });

    // Check if user already exists (verified account)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        error: 'User already exists with this email',
      });
      return;
    }

    // Check if there's already a pending registration
    const existingPending = await prisma.pendingUser.findUnique({
      where: { email },
    });

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Create or update pending user (not a real account yet)
    if (existingPending) {
      // Update existing pending registration with new data and OTP
      await prisma.pendingUser.update({
        where: { email },
        data: {
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          verificationOtp: otp,
          verificationOtpExpiry: otpExpiry,
        },
      });
    } else {
      // Create new pending registration
      await prisma.pendingUser.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          verificationOtp: otp,
          verificationOtpExpiry: otpExpiry,
        },
      });
    }

    // Send verification email
    const emailSent = await emailService.sendVerificationOTP(email, otp, firstName);
    
    if (!emailSent) {
      console.error('Failed to send verification email');
      // Continue anyway - user can request resend
    }

    res.status(201).json({
      message: 'Registration initiated. Please check your email for verification code.',
      email: email,
      requiresVerification: true,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user has a pending registration
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { email },
    });

    if (pendingUser) {
      res.status(403).json({
        error: 'Please verify your email to complete registration',
        requiresVerification: true,
        email: email,
      });
      return;
    }

    // Find verified user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        error: 'Invalid email or password',
      });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({
        error: 'Invalid email or password',
      });
      return;
    }

    // Generate JWT token
    const payload = { userId: user.id, email: user.email };
    const secret = config.jwt.secret;
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the token cookie
    res.clearCookie('token');

    res.json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        error: 'User not found',
      });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { firstName, lastName, phone } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        error: 'No token provided',
      });
      return;
    }

    // Verify current token
    const decoded = jwt.verify(token, config.jwt.secret) as any;

    // Generate new token
    const payload = { userId: decoded.userId, email: decoded.email };
    const secret = config.jwt.secret;
    const newToken = jwt.sign(payload, secret, { expiresIn: '7d' });

    // Set new HTTP-only cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      error: 'Invalid token',
    });
  }
};


// Verify email with OTP
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Check if user already exists (already verified)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        error: 'Email already verified and account created',
      });
      return;
    }

    // Find pending user
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { email },
    });

    if (!pendingUser) {
      res.status(404).json({
        error: 'No pending registration found for this email',
      });
      return;
    }

    // Check if OTP is expired
    if (isExpired(pendingUser.verificationOtpExpiry)) {
      res.status(400).json({
        error: 'Verification code has expired. Please request a new one.',
      });
      return;
    }

    // Verify OTP
    if (pendingUser.verificationOtp !== otp) {
      res.status(400).json({
        error: 'Invalid verification code',
      });
      return;
    }

    // Create the actual user account now that email is verified
    const newUser = await prisma.user.create({
      data: {
        email: pendingUser.email,
        password: pendingUser.password,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        phone: pendingUser.phone,
        role: pendingUser.role,
        verified: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });

    // Delete the pending user record
    await prisma.pendingUser.delete({
      where: { email },
    });

    // Generate JWT token
    const payload = { userId: newUser.id, email: newUser.email };
    const secret = config.jwt.secret;
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Email verified successfully. Your account has been created.',
      user: newUser,
      token,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

// Resend verification OTP
export const resendVerificationOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Check if user already exists (already verified)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        error: 'Email already verified',
      });
      return;
    }

    // Find pending user
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { email },
    });

    if (!pendingUser) {
      res.status(404).json({
        error: 'No pending registration found for this email',
      });
      return;
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Update pending user with new OTP
    await prisma.pendingUser.update({
      where: { email },
      data: {
        verificationOtp: otp,
        verificationOtpExpiry: otpExpiry,
      },
    });

    // Send verification email
    const emailSent = await emailService.sendVerificationOTP(email, otp, pendingUser.firstName);

    if (!emailSent) {
      res.status(500).json({
        error: 'Failed to send verification email',
      });
      return;
    }

    res.json({
      message: 'Verification code sent successfully',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

// Request password reset
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not for security
    if (!user) {
      res.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
      return;
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = getResetTokenExpiry();

    // Save reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    const emailSent = await emailService.sendPasswordResetEmail(email, resetToken, user.firstName);

    if (!emailSent) {
      console.error('Failed to send password reset email');
      // Don't reveal the error to user
    }

    res.json({
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({
        error: 'Token and new password are required',
      });
      return;
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user || !user.resetTokenExpiry) {
      res.status(400).json({
        error: 'Invalid or expired reset token',
      });
      return;
    }

    // Check if token is expired
    if (isExpired(user.resetTokenExpiry)) {
      res.status(400).json({
        error: 'Reset token has expired. Please request a new one.',
      });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
