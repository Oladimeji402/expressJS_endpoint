import { body, validationResult } from "express-validator";

const passwordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/; // at least 1 lower, 1 upper, 1 digit

export const signupValidators = [
  body("username")
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("phone")
    .isString()
    .trim()
    .matches(/^[0-9()+\- ]{7,20}$/)
    .withMessage("Invalid phone number"),
  body("password")
    .isLength({ min: 8, max: 128 })
    .matches(passwordPattern)
    .withMessage(
      "Password must include upper, lower and a number and be at least 8 chars"
    ),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
    next();
  },
];

export const loginValidators = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("password").optional().isString().withMessage("Invalid password"),
  body("otp").optional().isString().withMessage("Invalid otp"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
    next();
  },
];

export const requestOtpValidators = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
    next();
  },
];

export const verifyOtpValidators = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("otp").isString().trim().isLength({ min: 3 }).withMessage("Invalid otp"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
    next();
  },
];
