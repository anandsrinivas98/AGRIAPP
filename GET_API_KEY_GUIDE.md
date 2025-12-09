# 🔑 How to Get Your Own Indian Government API Key

## Step-by-Step Guide to Get API Key from data.gov.in

---

## 📋 **Step 1: Visit the Official Website**

Open your browser and go to:
```
https://data.gov.in/
```

---

## 📋 **Step 2: Create an Account**

### 2.1 Click "Sign Up" or "Register"
- Look for the **"Sign Up"** or **"Register"** button in the top-right corner
- Click on it

### 2.2 Fill in Registration Details

You'll need to provide:
- **Full Name**: Your name
- **Email Address**: Your valid email (you'll need to verify this)
- **Mobile Number**: Your Indian mobile number
- **Organization**: Your company/organization name (or "Individual")
- **Password**: Create a strong password
- **Confirm Password**: Re-enter your password

### 2.3 Accept Terms and Conditions
- Read and accept the terms of service
- Click **"Register"** or **"Submit"**

### 2.4 Verify Your Email
- Check your email inbox
- Look for verification email from data.gov.in
- Click the verification link
- Your account will be activated

---

## 📋 **Step 3: Log In to Your Account**

### 3.1 Go to Login Page
```
https://data.gov.in/user/login
```

### 3.2 Enter Credentials
- **Email**: Your registered email
- **Password**: Your password
- Click **"Login"**

---

## 📋 **Step 4: Generate API Key**

### 4.1 Navigate to API Section
After logging in:
1. Click on your **profile/username** (top-right corner)
2. Look for **"API Keys"** or **"My API Keys"** in the dropdown menu
3. Click on it

### 4.2 Request New API Key
1. Click **"Generate New API Key"** or **"Request API Key"**
2. Fill in the form:
   - **Purpose**: "Agricultural Marketplace Application"
   - **Application Name**: "AgriSense Marketplace"
   - **Description**: "Fetching real-time agricultural commodity prices"
3. Click **"Submit"** or **"Generate"**

### 4.3 Copy Your API Key
- Your API key will be displayed (looks like: `abc123def456...`)
- **IMPORTANT**: Copy it immediately and save it securely
- You may not be able to see it again!

---

## 📋 **Step 5: Update Your Environment File**

### 5.1 Open Your Environment File

Open this file in your editor:
```
frontend/.env.local
```

### 5.2 Replace the API Key

Find this line:
```bash
NEXT_PUBLIC_AGMARKNET_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
```

Replace with your new key:
```bash
NEXT_PUBLIC_AGMARKNET_API_KEY=your_new_api_key_here
```

### 5.3 Also Update OGD API Key

Find this line:
```bash
NEXT_PUBLIC_OGD_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
```

Replace with your new key:
```bash
NEXT_PUBLIC_OGD_API_KEY=your_new_api_key_here
```

### 5.4 Save the File
- Press `Ctrl + S` to save
- Make sure the file is saved

---

## 📋 **Step 6: Restart Your Server**

### 6.1 Stop the Current Server
In your terminal where the server is running:
- Press `Ctrl + C`
- Wait for it to stop

### 6.2 Clear the Cache
```powershell
Remove-Item -Recurse -Force frontend\.next
```

### 6.3 Restart the Server
```powershell
cd frontend
npm run dev
```

### 6.4 Wait for "Ready" Message
You should see:
```
✓ Ready in X s
```

---

## 📋 **Step 7: Verify It's Working**

### 7.1 Open Your Marketplace
```
http://localhost:3000/marketplace
```

### 7.2 Hard Refresh
Press `Ctrl + Shift + R` to clear browser cache

### 7.3 Check for Real Data
You should see:
- ✅ Prices with ₹ symbol
- ✅ Indian commodity names
- ✅ Indian market locations
- ✅ Real-time price changes

### 7.4 Check Browser Console
Press `F12` and look for:
- ✅ No red errors
- ✅ "Returning cached commodity prices"
- ✅ API calls to api.data.gov.in

---

## 🔍 **Alternative: Find Existing API Keys**

If you already have an account on data.gov.in:

### Option 1: Check Your Profile
1. Log in to https://data.gov.in/
2. Click your profile/username
3. Go to "API Keys" or "My Account"
4. Your existing keys should be listed

### Option 2: Check Email
- Search your email for "data.gov.in"
- Look for API key confirmation emails
- Your key might be in a previous email

---

## 📞 **Troubleshooting**

### Issue: Can't Find "API Keys" Section

**Solution**:
1. After logging in, look for:
   - "My Account"
   - "Profile Settings"
   - "Developer Tools"
   - "API Access"
2. The exact menu name may vary

### Issue: API Key Not Generated

**Solution**:
1. Check your email for verification
2. Make sure your account is fully activated
3. Try logging out and logging back in
4. Contact data.gov.in support if needed

### Issue: Forgot Which Email I Used

**Solution**:
1. Try all your email addresses
2. Use "Forgot Password" feature
3. Create a new account if needed

---

## 🎯 **Quick Summary**

1. ✅ Go to: https://data.gov.in/
2. ✅ Click "Sign Up" (top-right)
3. ✅ Fill in registration form
4. ✅ Verify your email
5. ✅ Log in to your account
6. ✅ Go to Profile → API Keys
7. ✅ Generate new API key
8. ✅ Copy the key
9. ✅ Update `frontend/.env.local`
10. ✅ Restart server
11. ✅ Refresh browser

---

## 📧 **Contact Information**

If you need help with data.gov.in:

**Website**: https://data.gov.in/  
**Support Email**: Check the "Contact Us" page on data.gov.in  
**Help Section**: https://data.gov.in/help

---

## 💡 **Important Notes**

### About API Keys
- ✅ **Free** - No cost for API access
- ✅ **Higher Limits** - Personal keys have higher rate limits
- ✅ **Better Reliability** - Personal keys are more stable
- ✅ **Production Ready** - Use personal keys for production

### Current Public Key
The public demo key currently in your `.env.local`:
```
579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
```

**Status**: 
- ✅ Works for testing
- ⚠️ Shared by many users
- ⚠️ May hit rate limits
- ⚠️ Not recommended for production

### Your Personal Key
Once you get your own key:
- ✅ Higher rate limits (1000+ requests/hour)
- ✅ Better reliability
- ✅ Production ready
- ✅ Dedicated to your application

---

## 🚀 **After Getting Your Key**

Once you have your personal API key:

1. **Update Environment File**:
   ```bash
   # In frontend/.env.local
   NEXT_PUBLIC_AGMARKNET_API_KEY=your_personal_key_here
   NEXT_PUBLIC_OGD_API_KEY=your_personal_key_here
   ```

2. **Restart Server**:
   ```powershell
   # Stop server (Ctrl+C)
   Remove-Item -Recurse -Force frontend\.next
   cd frontend
   npm run dev
   ```

3. **Test**:
   - Open http://localhost:3000/marketplace
   - Verify data loads
   - Check console for errors

---

## ✅ **Success Checklist**

- [ ] Visited https://data.gov.in/
- [ ] Created account
- [ ] Verified email
- [ ] Logged in
- [ ] Found API Keys section
- [ ] Generated new API key
- [ ] Copied API key
- [ ] Updated frontend/.env.local
- [ ] Saved the file
- [ ] Restarted server
- [ ] Cleared browser cache
- [ ] Verified marketplace shows real data

---

**Once you complete these steps, your marketplace will have a dedicated API key with higher rate limits and better reliability!** 🚀

**Current Status**: Your marketplace is working with the public demo key, but getting your own key will improve performance and reliability.
