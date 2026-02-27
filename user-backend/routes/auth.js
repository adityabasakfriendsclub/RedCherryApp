//======v2
"use strict";
// routes/auth.js  ─────────────────────────────────────────────────────────────

const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth_middleware");
const upload = require("../middleware/upload"); // ← new multer middleware

// ── REGISTER ──────────────────────────────────────────────────────────────────
router.post(
  "/register",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required."),
    body("lastName").trim().notEmpty().withMessage("Last name is required."),
    body("phoneNumber")
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Enter a valid 10-digit Indian mobile number."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
    body("gender")
      .optional()
      .isIn(["Male", "Female", "Other", "Prefer not to say"])
      .withMessage("Invalid gender value."),
    body("age")
      .optional()
      .isInt({ min: 13, max: 120 })
      .withMessage("Age must be between 13 and 120."),
  ],
  authController.register,
);

// ── VERIFY OTP (signup) ───────────────────────────────────────────────────────
router.post("/verify-otp", authController.verifyOTP);

// ── LOGIN ─────────────────────────────────────────────────────────────────────
router.post(
  "/login",
  [
    body("phoneNumber").notEmpty().withMessage("Phone number is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  authController.login,
);

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
router.post("/forgot-password", authController.forgotPassword);

// ── VERIFY RESET OTP ─────────────────────────────────────────────────────────
router.post("/verify-reset-otp", authController.verifyResetOTP);

// ── RESEND OTP ────────────────────────────────────────────────────────────────
router.post("/resend-otp", authController.resendOTP);

// ── GET CURRENT USER (protected) ──────────────────────────────────────────────
router.get("/me", protect, authController.getMe);

// ── UPDATE PROFILE (protected + file upload) ──────────────────────────────────
//
//   Middleware order matters:
//     1. protect          → verify JWT, attach req.user
//     2. upload.single()  → parse multipart/form-data, put file on req.file
//     3. updateProfile    → update MongoDB and return updated user
//
//   The field name "profilePicture" MUST match what the frontend sends:
//     formData.append("profilePicture", file)
//
router.put(
  "/profile",
  protect,
  upload.single("profilePicture"),
  authController.updateProfile,
);

module.exports = router;
