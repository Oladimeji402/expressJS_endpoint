import rateLimit, { ipKeyGenerator } from "express-rate-limit";

/**
 * Helper to safely read env numbers
 */
const envNumber = (key, fallback) => Number(process.env[key]) || fallback;

/**
 * Base config
 */
const baseConfig = {
  standardHeaders: true,
  legacyHeaders: false,
};

/**
 * SAFE key generators (IPv6 compliant)
 */
const ipEmailKey = (req) => {
  const ip = ipKeyGenerator(req);
  const email = req.body?.email || "unknown";
  return `${ip}:${email}`;
};

/**
 * LIMITERS
 */

export const signupLimiter = rateLimit({
  ...baseConfig,
  windowMs: envNumber("SIGNUP_RATE_WINDOW_MS", 15 * 60 * 1000),
  max: envNumber("SIGNUP_RATE_MAX", 5),
  keyGenerator: ipEmailKey,
  message: { error: "Too many signup attempts. Try again later." },
});

export const loginLimiter = rateLimit({
  ...baseConfig,
  windowMs: envNumber("LOGIN_RATE_WINDOW_MS", 15 * 60 * 1000),
  max: envNumber("LOGIN_RATE_MAX", 5),
  keyGenerator: ipEmailKey,
  message: { error: "Too many login attempts. Try again later." },
});

export const otpSendLimiter = rateLimit({
  ...baseConfig,
  windowMs: envNumber("OTP_SEND_WINDOW_MS", 15 * 60 * 1000),
  max: envNumber("OTP_SEND_MAX", 3),
  keyGenerator: ipEmailKey,
  message: { error: "Too many OTP requests. Please wait." },
});

export const otpVerifyLimiter = rateLimit({
  ...baseConfig,
  windowMs: envNumber("OTP_VERIFY_WINDOW_MS", 15 * 60 * 1000),
  max: envNumber("OTP_VERIFY_MAX", 5),
  keyGenerator: ipEmailKey,
  message: { error: "Too many OTP verification attempts." },
});
