import nodemailer from 'nodemailer';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const FROM_EMAIL = process.env.EMAIL_FROM || 'AgriSense <noreply@agrisense.com>';

// Brevo SMTP config
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER, // your Brevo login email
    pass: process.env.BREVO_SMTP_KEY,  // Brevo SMTP key
  },
});

class EmailService {
  async sendVerificationOTP(email: string, otp: string, firstName: string): Promise<boolean> {
    try {
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify Your AgriSense Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1>🌾 AgriSense</h1>
              <p>Email Verification</p>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2>Hello ${firstName}!</h2>
              <p>Thank you for registering with AgriSense. Use the OTP below to verify your email:</p>
              <div style="background: white; border: 2px dashed #10b981; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                <p style="margin: 0; color: #6b7280;">Your verification code is:</p>
                <div style="font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 8px;">${otp}</div>
              </div>
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        `,
      });
      console.log(`Verification OTP sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string, firstName: string): Promise<boolean> {
    const resetUrl = `${FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    try {
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: email,
        subject: 'Reset Your AgriSense Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1>🌾 AgriSense</h1>
              <p>Password Reset Request</p>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2>Hello ${firstName}!</h2>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${resetUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
              </div>
              <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
              <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
            </div>
          </div>
        `,
      });
      console.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
