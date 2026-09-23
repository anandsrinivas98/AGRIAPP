import rateLimit from 'express-rate-limit';

/**
 * Strict rate limiter for authentication endpoints (login, register, password reset).
 * Max 10 attempts per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

/**
 * High-sensitivity rate limiter for 6-digit OTP verification and resends.
 * Max 5 attempts per 10 minutes per IP to prevent OTP brute-forcing.
 */
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many verification attempts. Please wait 10 minutes before trying again.',
  },
});
