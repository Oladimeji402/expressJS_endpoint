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

import {
  signupLimiter,
  loginLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
} from "../middlewares/rateLimiters.js";

const router = Router();


router.post("/signup", signupLimiter, signupValidators, signup);

router.post("/login", loginLimiter, loginValidators, login);

router.post("/login/otp", otpSendLimiter, requestOtpValidators, requestOtp);

router.post("/verify-otp", otpVerifyLimiter, verifyOtpValidators, verifyOtp);

export default router;
