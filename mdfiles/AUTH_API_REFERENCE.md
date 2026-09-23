# 🔐 Authentication API Reference

## Base URL
```
http://localhost:5000/api/auth
```

## Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account. Sends verification OTP to email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890" // Optional
}
```

**Success Response (201):**
```json
{
  "message": "Registration successful. Please check your email for verification code.",
  "userId": "clx1234567890",
  "email": "user@example.com",
  "requiresVerification": true
}
```

**Error Responses:**
- `409` - User already exists
- `400` - Validation error
- `500` - Internal server error

---

### 2. Verify Email

**Endpoint:** `POST /api/auth/verify-email`

**Description:** Verify email address with OTP code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "verified": true,
    "role": "FARMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `404` - User not found
- `400` - Invalid or expired OTP
- `400` - Email already verified
- `500` - Internal server error

---

### 3. Resend Verification OTP

**Endpoint:** `POST /api/auth/resend-otp`

**Description:** Resend verification OTP to email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Verification code sent successfully"
}
```

**Error Responses:**
- `404` - User not found
- `400` - Email already verified
- `500` - Failed to send email

---

### 4. Login

**Endpoint:** `POST /api/auth/login`

**Description:** Login with email and password. Requires verified email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "verified": true,
    "role": "FARMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401` - Invalid credentials
- `403` - Email not verified (includes `requiresVerification: true`)
- `500` - Internal server error

**Email Not Verified Response (403):**
```json
{
  "error": "Please verify your email before logging in",
  "requiresVerification": true,
  "email": "user@example.com"
}
```

---

### 5. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`

**Description:** Request password reset. Sends reset link to email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "If an account exists with this email, you will receive a password reset link."
}
```

**Note:** Always returns success message for security (doesn't reveal if email exists).

---

### 6. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Description:** Reset password using token from email.

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "newPassword": "NewSecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully. You can now login with your new password."
}
```

**Error Responses:**
- `400` - Invalid or expired token
- `400` - Token and password required
- `500` - Internal server error

---

### 7. Get Profile

**Endpoint:** `GET /api/auth/me`

**Description:** Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": "clx1234567890",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "avatar": null,
  "role": "FARMER",
  "verified": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - User not found

---

### 8. Update Profile

**Endpoint:** `PUT /api/auth/me`

**Description:** Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "verified": true,
    "role": "FARMER"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `400` - Validation error

---

### 9. Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user (clears cookies).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### 10. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Description:** Refresh access token.

**Success Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401` - Invalid token

---

## Authentication

Most endpoints require authentication using JWT tokens.

**Include token in requests:**

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

**Cookie:**
```
token=<your_jwt_token>
```

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

---

## Validation Rules

### Email
- Must be valid email format
- Normalized to lowercase

### Password
- Minimum 6 characters
- Must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

### Name Fields
- Minimum 1 character
- Trimmed of whitespace

### Phone
- Optional field
- Must be valid mobile phone format

---

## Rate Limiting

Authentication endpoints are rate-limited to prevent abuse:
- 5 requests per minute per IP for login/register
- 3 requests per minute for password reset
- 10 requests per minute for other endpoints

**Rate Limit Response (429):**
```json
{
  "error": "Too many requests, please try again later"
}
```

---

## Token Expiration

- **Access Token:** 7 days
- **Verification OTP:** 10 minutes
- **Reset Token:** 1 hour

---

## Testing with cURL

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Verify Email:
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }'
```

### Get Profile:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token>"
```

---

## Testing with Postman

1. Import the endpoints into Postman
2. Set base URL as environment variable
3. Use collection variables for tokens
4. Test the complete flow:
   - Register → Verify → Login → Get Profile

---

## Frontend Integration

### Using Axios:

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Register
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, userData);
  return response.data;
};

// Verify Email
const verifyEmail = async (email, otp) => {
  const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
    email,
    otp
  });
  return response.data;
};

// Login
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password
  });
  return response.data;
};

// Set token in headers
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

---

## Status Codes Summary

- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden (email not verified)
- `404` - Not Found
- `409` - Conflict (user exists)
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Security Notes

1. **Never log passwords** in production
2. **Always use HTTPS** in production
3. **Store tokens securely** (httpOnly cookies or secure storage)
4. **Validate all inputs** on both client and server
5. **Rate limit** authentication endpoints
6. **Monitor** for suspicious activity
7. **Use strong JWT secrets** in production

---

## Support

For issues or questions:
- Check the setup guide: `AUTH_SYSTEM_SETUP_GUIDE.md`
- Review backend logs for errors
- Test with cURL to isolate frontend/backend issues
