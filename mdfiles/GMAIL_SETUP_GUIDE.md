# 📧 Gmail Setup Guide for Authentication (FREE)

## Quick Setup (5 minutes)

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left menu
3. Find **2-Step Verification** (under "How you sign in to Google")
4. Click **Get Started** and follow the steps
5. Verify with your phone number

### Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to **Security**
2. Find **App passwords** (under "How you sign in to Google")
   - If you don't see it, search "App passwords" in the search bar
3. Click **App passwords**
4. You might need to sign in again
5. In the "Select app" dropdown, choose **Mail**
6. In the "Select device" dropdown, choose **Other (Custom name)**
7. Type: **AgriSense App**
8. Click **Generate**
9. **COPY THE 16-CHARACTER PASSWORD** (it looks like: `abcd efgh ijkl mnop`)
   - You won't be able to see it again!

### Step 3: Update Your `.env` File

Open `backend/.env` and update these lines:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=AgriSense <your_actual_email@gmail.com>
FRONTEND_URL=http://localhost:3000
```

**Replace:**
- `your_actual_email@gmail.com` → Your real Gmail address
- `abcdefghijklmnop` → The 16-character app password (remove spaces)

**Example:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=AgriSense <john.doe@gmail.com>
FRONTEND_URL=http://localhost:3000
```

### Step 4: Test Email Configuration

Run this command to test if emails work:

```bash
cd backend
node test-email.js your_actual_email@gmail.com
```

You should receive a test email within seconds!

---

## Troubleshooting

### "Invalid login" error
- Make sure you're using the **App Password**, not your regular Gmail password
- Remove any spaces from the app password
- Make sure 2-Step Verification is enabled

### "Less secure app access" error
- This is old - you need to use App Passwords instead
- Follow Step 1 and Step 2 above

### Email goes to spam
- This is normal for development
- Check your spam folder
- In production, use a custom domain

### Can't find "App passwords"
- Make sure 2-Step Verification is enabled first
- Try this direct link: https://myaccount.google.com/apppasswords
- Sign in if prompted

---

## Gmail Free Tier Limits

✅ **Sending Limit:** 500 emails per day (plenty for development!)
✅ **Cost:** Completely FREE
✅ **Perfect for:** Development, testing, small apps

For production with more users, consider:
- **SendGrid:** 100 emails/day free
- **Mailgun:** 5,000 emails/month free
- **AWS SES:** 62,000 emails/month free (with EC2)

---

## Security Notes

⚠️ **Important:**
- Never commit your App Password to Git
- The `.env` file is already in `.gitignore`
- Use different passwords for development and production
- Revoke app passwords you're not using

---

## Quick Reference

**Gmail SMTP Settings:**
```
Host: smtp.gmail.com
Port: 587
Security: STARTTLS
```

**App Password Format:**
- 16 characters
- No spaces
- Letters only (lowercase)
- Example: `abcdefghijklmnop`

---

## Next Steps

After setup:
1. ✅ Test with `node test-email.js`
2. ✅ Restart your backend server
3. ✅ Try registering a new user
4. ✅ Check your email for OTP
5. ✅ Test the complete auth flow

---

**Setup Time:** ~5 minutes  
**Cost:** FREE  
**Daily Limit:** 500 emails  
**Perfect for:** Development & Testing
