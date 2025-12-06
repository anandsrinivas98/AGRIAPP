# Quick Reference - Email Verification Flow

## 🎯 What Changed?
User accounts are now created **AFTER** email verification, not before.

## 📊 Database Tables

| Table | Purpose | When Created |
|-------|---------|--------------|
| `pending_users` | Temporary storage for unverified registrations | During registration |
| `users` | Verified user accounts | After OTP verification |

## 🔄 API Endpoints

### 1. Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```

**Response (201):**
```json
{
  "message": "Registration initiated. Please check your email for verification code.",
  "email": "user@example.com",
  "requiresVerification": true
}
```

### 2. Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully. Your account has been created.",
  "user": { ... },
  "token": "eyJhbGc..."
}
```

### 3. Resend OTP
```http
POST /api/auth/resend-verification-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Verification code sent successfully"
}
```

### 4. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200 - Verified):**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGc..."
}
```

**Response (403 - Unverified):**
```json
{
  "error": "Please verify your email to complete registration",
  "requiresVerification": true,
  "email": "user@example.com"
}
```

## 🛠️ Commands

```bash
# Start development server
npm run dev

# Run database migration
npm run migrate

# Generate Prisma client
npm run generate

# Manual cleanup of expired pending users
npm run cleanup:pending

# Test registration flow
node test-registration-flow.js

# Check TypeScript errors
npx tsc --noEmit
```

## 🔍 Debugging

### Check pending registrations
```sql
SELECT * FROM pending_users;
```

### Check verified users
```sql
SELECT * FROM users;
```

### Find OTP for testing (development only)
```sql
SELECT email, "verificationOtp", "verificationOtpExpiry" 
FROM pending_users 
WHERE email = 'test@example.com';
```

## ⏰ Automatic Cleanup

- **Schedule:** Daily at 2:00 AM
- **Action:** Deletes pending users with expired OTP (>24 hours old)
- **Location:** `backend/src/services/cronService.ts`

## 📝 Frontend Integration

```typescript
// 1. Register
async function register(userData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
}

// 2. Verify OTP
async function verifyEmail(email, otp) {
  const response = await fetch('/api/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  return response.json();
}

// 3. Resend OTP
async function resendOTP(email) {
  const response = await fetch('/api/auth/resend-verification-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
}

// Usage
const result = await register(userData);
if (result.requiresVerification) {
  // Show OTP input form
  const otp = await getUserOTPInput();
  const verifyResult = await verifyEmail(result.email, otp);
  // User is now logged in with verifyResult.token
}
```

## ❌ Common Errors

| Status | Error | Cause | Solution |
|--------|-------|-------|----------|
| 409 | User already exists | Email already registered | Use different email or login |
| 403 | Please verify email | Pending registration exists | Verify email with OTP |
| 400 | Invalid verification code | Wrong OTP | Check email or resend OTP |
| 400 | Verification code expired | OTP > 10 minutes old | Request new OTP |
| 404 | No pending registration | No registration found | Register first |

## 🧪 Testing Checklist

- [ ] Register new user → Creates pending record
- [ ] Check `pending_users` table → Record exists
- [ ] Try login before verification → Blocked (403)
- [ ] Verify with wrong OTP → Error (400)
- [ ] Verify with correct OTP → Account created
- [ ] Check `users` table → User exists
- [ ] Check `pending_users` table → Record deleted
- [ ] Login after verification → Success (200)
- [ ] Resend OTP → New code sent

## 📚 Documentation Files

- `AUTH_VERIFICATION_FLOW.md` - Detailed documentation
- `REGISTRATION_FLOW_DIAGRAM.md` - Visual flow diagrams
- `REGISTRATION_CHANGES_SUMMARY.md` - Summary of changes
- `QUICK_REFERENCE.md` - This file

## 🆘 Troubleshooting

### OTP not received
1. Check email service configuration in `.env`
2. Check backend logs for email errors
3. Verify SMTP credentials
4. Check spam folder

### Login still blocked after verification
1. Check if user exists in `users` table
2. Check if pending record was deleted
3. Clear browser cookies
4. Try with fresh registration

### Cron job not running
1. Check server logs for cron initialization
2. Verify `node-cron` is installed
3. Check `cronService.ts` for errors

### Database out of sync
```bash
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

## 🔐 Security Notes

- Passwords are hashed with bcrypt (12 rounds)
- OTP expires after 10 minutes
- Pending registrations auto-deleted after 24 hours
- JWT tokens expire after 7 days
- HTTP-only cookies prevent XSS attacks
- Rate limiting on API endpoints

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review backend logs
3. Test with `test-registration-flow.js`
4. Check database tables directly
5. Verify environment variables in `.env`
