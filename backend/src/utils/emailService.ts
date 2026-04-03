const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || 'agrisensereg@gmail.com';
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';

async function sendEmail(to: string, name: string, subject: string, html: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'AgriSense', email: FROM_EMAIL },
        to: [{ email: to, name }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Brevo API error:', error);
      return false;
    }

    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

class EmailService {
  async sendVerificationOTP(email: string, otp: string, firstName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>🌾 AgriSense</h1><p>Email Verification</p>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2>Hello ${firstName}!</h2>
          <p>Thank you for registering with AgriSense. To complete your registration, please verify your email address using the OTP below:</p>
          <div style="background: white; border: 2px dashed #10b981; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <p style="margin: 0; color: #6b7280;">Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 8px;">${otp}</div>
          </div>
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't create an account with AgriSense, please ignore this email.</p>
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">© 2025 AgriSense. All rights reserved.</p>
        </div>
      </div>`;
    return sendEmail(email, firstName, 'Verify Your AgriSense Account', html);
  }

  async sendPasswordResetEmail(email: string, resetToken: string, firstName: string): Promise<boolean> {
    const resetUrl = `${FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>🌾 AgriSense</h1><p>Password Reset</p>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2>Hello ${firstName}!</h2>
          <p>Click below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          <p>Link expires in 1 hour.</p>
        </div>
      </div>`;
    return sendEmail(email, firstName, 'Reset Your AgriSense Password', html);
  }
}

export const emailService = new EmailService();
