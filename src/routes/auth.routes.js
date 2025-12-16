import { Router } from "express";
import {
  signup,
  verifyOtp,
  login,
  requestOtp,
} from "../controllers/auth.controller.js";
import {
  signupValidators,
  verifyOtpValidators,
  loginValidators,
  requestOtpValidators,
} from "../middlewares/validators.js";
import { authLimiter, otpLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

// Apply rate limits and validation per route
router.post("/signup", authLimiter, signupValidators, signup);
router.post("/verify-otp", authLimiter, verifyOtpValidators, verifyOtp);
router.post("/login", authLimiter, loginValidators, login);
router.post("/login/otp", otpLimiter, requestOtpValidators, requestOtp);

export default router;
