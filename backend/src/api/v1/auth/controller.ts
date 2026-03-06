import { Request, Response } from 'express';
import { AuthService } from '../../../core/services/AuthService';
import { ApiResponse } from '../../../shared/utils/ApiResponse';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      ApiResponse.success(res, result, 'Registration successful. Please check your email for verification.');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp } = req.body;
      const result = await this.authService.verifyEmail(email, otp);
      ApiResponse.success(res, result, 'Email verified successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      ApiResponse.success(res, result, 'Login successful');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 401);
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      ApiResponse.success(res, null, 'Password reset email sent');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      ApiResponse.success(res, null, 'Password reset successful');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 400);
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      ApiResponse.success(res, result, 'Token refreshed successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message, 401);
    }
  };
}