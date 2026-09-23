# Email Verification Before Account Creation

## Overview

The authentication system has been updated to ensure that user accounts are **only created after email verification**, not before. This prevents unverified accounts from cluttering the database and ensures better security.

## How It Works

### Previous Flow (Old)
1. User submits registration form
2. ❌ **Account created immediately** in `users` table (unverified)
3. Verification email sent
4. User verifies email → account marked as verified

### New Flow (Current)
1. User submits registration form
2. ✅ **Pending registration stored** in `pending_users` table
3. Verification email sent with OTP
4. User verifies email with OTP → **Account created** in `users` table
5. Pending registration deleted

## Database Changes

### New Table: `pending_users`
Stores temporary registration data until email is verified:

```prisma
model PendingUser {
  id                    String   @id @default(cuid())
  email                 String   @unique
  password              String   // hashed
  firstName             String
  lastName              String
  phone                 String?
  role                  UserRole @default(FARMER)
  verificationOtp       String
  verificationOtpExpiry DateTime
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

### Updated Table: `users`
- Removed `verificationOtp` and `verificationOtpExpiry` fields
- `verified` field now defaults to `true` (since accounts are only created after verification)

## API Endpoints

### 1. POST `/api/auth/register`
**Purpose:** Initiate registration (creates pending user, not actual account)

**Request:**
```json
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

**What Happens:**
- Checks if email already exists in `users` table (verified accounts)
- Checks if email exists in `pending_users` table
- Creates or updates pending user record
- Sends verification OTP via email
- **Does NOT create actual user account yet**

### 2. POST `/api/auth/verify-email`
**Purpose:** Verify email and create actual user account

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully. Your account has been created.",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "FARMER",
    "verified": true
  },
  "token": "eyJhbGc..."
}
```

**What Happens:**
- Validates OTP from `pending_users` table
- Creates actual user account in `users` table
- Deletes pending user record
- Generates JWT token
- User is now logged in

### 3. POST `/api/auth/login`
**Purpose:** Login with verified account

**Behavior:**
- If email exists in `pending_users`: Returns 403 with "Please verify your email"
- If email exists in `users`: Proceeds with normal login
- If email doesn't exist: Returns 401 "Invalid credentials"

### 4. POST `/api/auth/resend-verification-otp`
**Purpose:** Resend verification code

**Request:**
```json
{
  "email": "user@example.com"
}
```

**What Happens:**
- Checks `pending_users` table for the email
- Generates new OTP
- Sends new verification email

## Benefits

### 1. **Cleaner Database**
- No unverified accounts in the main `users` table
- Pending registrations can be easily cleaned up (e.g., delete after 24 hours)

### 2. **Better Security**
- Prevents spam registrations from creating permanent records
- Reduces database bloat from abandoned registrations

### 3. **Clear User States**
- Pending: In `pending_users` table
- Verified: In `users` table
- No ambiguous "verified: false" state

### 4. **Easier Maintenance**
- Can add a cron job to clean up expired pending registrations
- Simpler user management (all users in `users` table are verified)

## Migration

The database migration was created and applied:
```bash
npx prisma migrate dev --name add-pending-users-table
```

**Migration includes:**
- Creates `pending_users` table
- Removes `verificationOtp` and `verificationOtpExpiry` from `users` table
- Updates `verified` default to `true` in `users` table

## Testing

Run the test script to verify the flow:
```bash
cd backend
node test-registration-flow.js
```

**Test Steps:**
1. Registers a new user → Creates pending record
2. Attempts login → Should be blocked
3. Verify email with OTP → Creates actual account
4. Login → Should succeed

## Frontend Integration

Update your frontend registration flow:

```typescript
// 1. Register
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData)
});

// 2. Show OTP verification form
if (registerResponse.data.requiresVerification) {
  showOTPForm(registerResponse.data.email);
}

// 3. Verify OTP
const verifyResponse = await fetch('/api/auth/verify-email', {
  method: 'POST',
  body: JSON.stringify({ email, otp })
});

// 4. User is now logged in with token
if (verifyResponse.ok) {
  const { token, user } = verifyResponse.data;
  // Store token and redirect to dashboard
}
```

## Error Handling

### Registration Errors
- `409`: Email already exists (verified account)
- `500`: Server error

### Verification Errors
- `404`: No pending registration found
- `400`: Invalid or expired OTP
- `400`: Email already verified

### Login Errors
- `403`: Email not verified (pending registration exists)
- `401`: Invalid credentials
- `500`: Server error

## Future Enhancements

1. **Auto-cleanup**: Add cron job to delete expired pending registrations
2. **Rate limiting**: Limit OTP resend requests
3. **Email templates**: Improve verification email design
4. **SMS verification**: Add phone number verification option
5. **Social auth**: Integrate OAuth providers (Google, Facebook, etc.)

## Rollback

If you need to rollback to the old system:
```bash
cd backend
npx prisma migrate reset
# Then restore the old schema and controller code
```

## Support

For issues or questions, check:
- Backend logs: `backend/logs/`
- Database: Check `pending_users` and `users` tables
- Email service: Verify SMTP configuration in `.env`
