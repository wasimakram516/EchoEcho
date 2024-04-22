const express = require("express");
const router = express.Router();
const {authUser} = require("../middleware/auth");

const {
  newUserValidationRules,
  updatedUserValidationRules,
  loginValidationRules,
  updatePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../middleware/validationRules");
const {
  register,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  updateUserPassword,
} = require("../controllers/usersController");

// Register a new user
router.post("/register", newUserValidationRules, register);

// User login
router.post("/login", loginValidationRules, login);

// User logout
router.post("/logout", authUser, logout);

// Get the logged-in user's details
router.get("/profile", authUser, getUserProfile);

// Update logged-in user's profile
router.put(
  "/profile",
  [updatedUserValidationRules, authUser],
  updateUserProfile
);

// Update user password
router.put("/password",[updatePasswordValidation, authUser],updateUserPassword);

// User forgot password
router.post("/forgot-password",[forgotPasswordValidation,authUser], forgotPassword);

// User reset password
router.post(
  "/reset-password",
  [resetPasswordValidation, authUser],
  resetPassword
  );
  
  
  module.exports = router;
