# Migration Guide - Existing Users

## ⚠️ Important Notice

If you have existing unverified users in your database, follow this guide to handle them properly.

## Current Database State

After running the migration, you may have:
1. ✅ Verified users in `users` table (no action needed)
2. ❌ Unverified users in `users` table (need to handle)

## Option 1: Delete All Unverified Users (Recommended)

If you're okay with removing unverified accounts:

```sql
-- Check how many unverified users exist
SELECT COUNT(*) FROM users WHERE verified = false;

-- Delete unverified users
DELETE FROM users WHERE verified = false;
```

**Why this is recommended:**
- These users never verified their email
- They can re-register if needed
- Keeps database clean

## Option 2: Migrate Unverified Users to Pending

If you want to preserve unverified registrations:

```sql
-- Insert unverified users into pending_users table
INSERT INTO pending_users (
  id,
  email,
  password,
  "firstName",
  "lastName",
  phone,
  role,
  "verificationOtp",
  "verificationOtpExpiry",
  "createdAt",
  "updatedAt"
)
SELECT 
  id,
  email,
  password,
  "firstName",
  "lastName",
  phone,
  role,
  COALESCE("verificationOtp", '000000'), -- Default OTP if null
  COALESCE("verificationOtpExpiry", NOW() + INTERVAL '10 minutes'), -- New expiry
  "createdAt",
  "updatedAt"
FROM users
WHERE verified = false;

-- Delete unverified users from users table
DELETE FROM users WHERE verified = false;
```

**Note:** Users will need to request a new OTP since the old ones may be expired.

## Option 3: Auto-Verify Existing Users

If you want to keep all existing users as verified:

```sql
-- Mark all users as verified
UPDATE users SET verified = true WHERE verified = false;
```

**Use this if:**
- You trust existing registrations
- You don't want users to re-verify
- You're in development/testing phase

## Post-Migration Checklist

After choosing an option above:

- [ ] Verify `users` table has no `verified = false` records
  ```sql
  SELECT COUNT(*) FROM users WHERE verified = false;
  -- Should return 0
  ```

- [ ] Check `pending_users` table
  ```sql
  SELECT COUNT(*) FROM pending_users;
  -- Should show pending registrations (if any)
  ```

- [ ] Test new registration flow
  ```bash
  node backend/test-registration-flow.js
  ```

- [ ] Restart backend server
  ```bash
  npm run dev
  ```

- [ ] Monitor logs for any errors

## Handling Edge Cases

### Case 1: User registered but never received OTP

**Before migration:**
- User exists in `users` table with `verified = false`
- No way to resend OTP (old system)

**After migration:**
- If you chose Option 1: User deleted, can re-register
- If you chose Option 2: User in `pending_users`, can request new OTP
- If you chose Option 3: User auto-verified, can login

### Case 2: User verified but flag not updated

**Check:**
```sql
SELECT * FROM users WHERE verified = false AND "createdAt" < NOW() - INTERVAL '1 day';
```

**Action:**
If these users have been using the system, they should be verified:
```sql
UPDATE users 
SET verified = true 
WHERE verified = false 
  AND "createdAt" < NOW() - INTERVAL '1 day';
```

### Case 3: Duplicate emails between tables

**Check:**
```sql
SELECT u.email 
FROM users u
INNER JOIN pending_users pu ON u.email = pu.email;
```

**Action:**
This shouldn't happen, but if it does:
```sql
-- Keep verified user, remove pending
DELETE FROM pending_users 
WHERE email IN (SELECT email FROM users);
```

## Rollback Plan

If you need to rollback the migration:

```bash
# 1. Backup current database
pg_dump -U your_user -d your_database > backup_before_rollback.sql

# 2. Reset migrations
cd backend
npx prisma migrate reset

# 3. Restore old schema from git
git checkout HEAD~1 -- prisma/schema.prisma

# 4. Run old migrations
npx prisma migrate dev

# 5. Restore old controller code
git checkout HEAD~1 -- src/controllers/authController.ts
```

## Testing After Migration

### 1. Test Existing Verified Users
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"existing@user.com","password":"password123"}'
```

Expected: ✅ Login successful

### 2. Test New Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"new@user.com",
    "password":"password123",
    "firstName":"New",
    "lastName":"User"
  }'
```

Expected: ✅ Registration initiated, OTP sent

### 3. Test Login Before Verification
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"new@user.com","password":"password123"}'
```

Expected: ❌ 403 Forbidden - "Please verify your email"

## Database Cleanup Script

Create a script to clean up old data:

```sql
-- Remove pending users older than 7 days (very old)
DELETE FROM pending_users 
WHERE "createdAt" < NOW() - INTERVAL '7 days';

-- Check for any orphaned data
SELECT 'Unverified users' as issue, COUNT(*) as count 
FROM users WHERE verified = false
UNION ALL
SELECT 'Old pending users', COUNT(*) 
FROM pending_users WHERE "createdAt" < NOW() - INTERVAL '1 day';
```

## Monitoring

After migration, monitor these metrics:

1. **Pending Users Count**
   ```sql
   SELECT COUNT(*) FROM pending_users;
   ```
   Should decrease over time as users verify or expire

2. **Verified Users Count**
   ```sql
   SELECT COUNT(*) FROM users;
   ```
   Should increase as new users verify

3. **Registration Completion Rate**
   ```sql
   SELECT 
     (SELECT COUNT(*) FROM users WHERE "createdAt" > NOW() - INTERVAL '7 days') as verified,
     (SELECT COUNT(*) FROM pending_users) as pending;
   ```

4. **Failed Verifications**
   Check backend logs for:
   - Invalid OTP attempts
   - Expired OTP errors
   - Email sending failures

## Support Queries

### Find user by email
```sql
-- Check if user is verified
SELECT * FROM users WHERE email = 'user@example.com';

-- Check if user has pending registration
SELECT * FROM pending_users WHERE email = 'user@example.com';
```

### Manually verify a user (emergency)
```sql
-- If user is in pending_users, move to users
INSERT INTO users (
  email, password, "firstName", "lastName", phone, role, verified
)
SELECT 
  email, password, "firstName", "lastName", phone, role, true
FROM pending_users
WHERE email = 'user@example.com';

DELETE FROM pending_users WHERE email = 'user@example.com';
```

### Reset user's verification
```sql
-- Delete from users (if exists)
DELETE FROM users WHERE email = 'user@example.com';

-- User can now re-register
```

## FAQ

**Q: What happens to users who registered but never verified?**
A: Depends on your choice:
- Option 1: Deleted, they need to re-register
- Option 2: Moved to pending_users, they can request new OTP
- Option 3: Auto-verified, they can login

**Q: Can users with pending registrations login?**
A: No, they must verify their email first.

**Q: How long do pending registrations last?**
A: 24 hours, then automatically deleted by cron job.

**Q: What if a user loses their OTP?**
A: They can request a new one via `/api/auth/resend-verification-otp`

**Q: Can I change the OTP expiry time?**
A: Yes, edit `getOTPExpiry()` in `backend/src/utils/otpGenerator.ts`

**Q: Can I disable the automatic cleanup?**
A: Yes, comment out the cron job in `backend/src/services/cronService.ts`

## Conclusion

Choose the migration option that best fits your needs:
- **Production with real users:** Option 3 (auto-verify existing)
- **Development/Testing:** Option 1 (delete unverified)
- **Want to preserve data:** Option 2 (migrate to pending)

After migration, the new flow ensures all future users are verified before account creation.
