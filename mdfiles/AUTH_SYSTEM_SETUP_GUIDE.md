# 🔐 Authentication System Setup Guide

## Overview

Your AgriSense application now has a complete authentication system with:
- ✅ Email verification using 6-digit OTP
- ✅ Forgot password functionality
- ✅ Secure password reset flow
- ✅ Resend OTP option
- ✅ Token expiration handling
- ✅ Beautiful, responsive UI

## 🚀 Quick Start

### 1. Database Migration

First, update your database schema to include the new fields:

```bash
cd backend
npx prisma migrate dev --name add_email_verification_and_password_reset
npx prisma generate
```

### 2. Email Configuration

#### Option A: Gmail (Recommended for Development)

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification (enable if not already)
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password

Update `backend/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=AgriSense <noreply@agrisense.com>
FRONTEND_URL=http://localhost:3000
```

#### Option B: Other Email Services

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

**SendGrid (Production):**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

**Mailgun (Production):**
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your_mailgun_username
EMAIL_PASSWORD=your_mailgun_password
```

### 3. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📋 Features

### 1. Email Verification Flow

**Registration Process:**
1. User fills registration form
2. System creates unverified account
3. 6-digit OTP sent to email (expires in 10 minutes)
4. User enters OTP on verification page
5. Account activated, user logged in automatically

**API Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-otp` - Resend verification code

### 2. Password Reset Flow

**Reset Process:**
1. User clicks "Forgot Password" on login page
2. Enters email address
3. Receives reset link via email (expires in 1 hour)
4. Clicks link, redirected to reset password page
5. Sets new password
6. Can login with new credentials

**API Endpoints:**
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### 3. Security Features

- ✅ OTP expires after 10 minutes
- ✅ Reset tokens expire after 1 hour
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ Rate limiting on auth endpoints
- ✅ Secure token generation using crypto
- ✅ Email verification required before login
- ✅ Password strength validation

## 🎨 UI Pages

### New Pages Created:

1. **Email Verification** (`/auth/verify-email`)
   - 6-digit OTP input with auto-focus
   - Resend OTP with 60-second countdown
   - Paste support for OTP codes
   - Beautiful animations

2. **Forgot Password** (`/auth/forgot-password`)
   - Email input
   - Success confirmation
   - Security notice

3. **Reset Password** (`/auth/reset-password`)
   - New password input with strength indicator
   - Confirm password validation
   - Password requirements checklist
   - Success confirmation

### Updated Pages:

1. **Login** (`/auth/login`)
   - Added "Forgot Password" link
   - Redirects to verification if email not verified

2. **Register** (`/auth/register`)
   - Redirects to email verification after registration

## 🧪 Testing the System

### Test Email Verification:

1. Register a new account
2. Check your email for the OTP
3. Enter the OTP on verification page
4. Should be logged in automatically

### Test Password Reset:

1. Go to login page
2. Click "Forgot Password"
3. Enter your email
4. Check email for reset link
5. Click link and set new password
6. Login with new password

### Test Resend OTP:

1. Register a new account
2. Wait for OTP to arrive
3. Click "Resend Code" on verification page
4. Check for new OTP in email

## 🔧 Configuration Options

### OTP Settings

Edit `backend/src/utils/otpGenerator.ts`:

```typescript
// Change OTP expiry time (default: 10 minutes)
export function getOTPExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}
```

### Reset Token Settings

```typescript
// Change reset token expiry (default: 1 hour)
export function getResetTokenExpiry(): Date {
  return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
}
```

### Email Templates

Customize email templates in `backend/src/utils/emailService.ts`:
- `sendVerificationOTP()` - Verification email template
- `sendPasswordResetEmail()` - Password reset email template

## 📱 Email Templates

Both email templates are:
- ✅ Mobile responsive
- ✅ Branded with AgriSense colors
- ✅ Professional design
- ✅ Clear call-to-action
- ✅ Security notices included

## 🐛 Troubleshooting

### Email Not Sending

**Check:**
1. Email credentials in `.env` are correct
2. App password (not regular password) for Gmail
3. 2-Step Verification enabled for Gmail
4. Check spam/junk folder
5. Check backend console for errors

**Test email configuration:**
```bash
cd backend
node -e "require('./src/utils/emailService').emailService.sendEmail({to:'test@example.com',subject:'Test',html:'Test'})"
```

### OTP Not Working

**Check:**
1. OTP hasn't expired (10 minutes)
2. Correct email address
3. Database has OTP stored
4. No typos in OTP entry

### Reset Link Not Working

**Check:**
1. Link hasn't expired (1 hour)
2. Token in URL is complete
3. Database has reset token stored
4. Frontend URL in `.env` is correct

### Database Issues

**Reset database:**
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

## 🔒 Security Best Practices

### For Production:

1. **Use Environment Variables:**
   - Never commit `.env` files
   - Use secure secret management

2. **Email Service:**
   - Use professional email service (SendGrid, Mailgun, AWS SES)
   - Set up SPF, DKIM, DMARC records
   - Monitor email delivery rates

3. **Rate Limiting:**
   - Already implemented in backend
   - Consider additional protection for auth endpoints

4. **HTTPS:**
   - Always use HTTPS in production
   - Update `secure: true` in cookie settings

5. **Password Policy:**
   - Current: min 6 chars, uppercase, lowercase, number
   - Consider adding special characters requirement

## 📊 Database Schema

New fields added to User model:

```prisma
model User {
  // ... existing fields
  
  // Email verification
  verificationOtp String?
  verificationOtpExpiry DateTime?
  
  // Password reset
  resetToken String?
  resetTokenExpiry DateTime?
}
```

## 🎯 Next Steps

### Optional Enhancements:

1. **SMS Verification:**
   - Add phone number verification
   - Use Twilio or similar service

2. **Social Login:**
   - Google OAuth
   - Facebook Login
   - GitHub OAuth

3. **Two-Factor Authentication:**
   - TOTP-based 2FA
   - Backup codes

4. **Email Preferences:**
   - Allow users to manage email notifications
   - Unsubscribe options

5. **Account Security:**
   - Login history
   - Active sessions management
   - Suspicious activity alerts

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review backend console logs
3. Check browser console for frontend errors
4. Verify all environment variables are set

## 🎉 Success!

Your authentication system is now complete with:
- ✅ Secure email verification
- ✅ Password reset functionality
- ✅ Beautiful, user-friendly UI
- ✅ Production-ready security
- ✅ Comprehensive error handling

Happy coding! 🚀
