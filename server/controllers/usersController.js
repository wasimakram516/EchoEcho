const User = require("../models/User");
const { generateTokens } = require("../utils/tokenUtils");
const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const PasswordResetToken = require("../models/PasswordResetToken");
const { sendPasswordResetEmail } = require("../utils/emailService");
const crypto=require("crypto");
const RefreshToken = require("../models/RefreshToken");

exports.register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors
        .array()
        .map((err) => err.msg)
        .join(". "),
      400
    );
  }
  const { username, password, email, profileName, profilePicture, bio } =
    req.body;
  let newUser = new User({
    username,
    email,
    password,
    profileName,
    bio,
    friends: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
  });

  await newUser.save();

  const tokens = await generateTokens(newUser.id);

  res.status(201).json({
    AccessToken: tokens.accessToken,
    RefreshToken: tokens.refreshToken,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors
        .array()
        .map((err) => err.msg)
        .join(". "),
      400
    );
  }

  const { email, password } = req.body;
  // if email doesn't match
  let user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid Credentials!",400);
  }

  // if email matches, verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid Credentials.", 400); 
  }

  const tokens = await generateTokens(user.id);
  res.status(201).json({
    AccessToken: tokens.accessToken,
    RefreshToken: tokens.refreshToken,
  });

});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new AppError("Refresh token not found.", 404);
  }

  // Remove the refresh token from the database
  const result = await RefreshToken.findOneAndDelete({
    token: refreshToken,
    user: req.user.id,
  });
  if (result) {
    res.status(204).send(); // No content to send back upon successful deletion
  } else {
    throw new AppError("Refresh token not found.", 404);
  }
});

// Method to load details of a user
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  res.status(200).json(user);
});

exports.updateUserProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors
        .array()
        .map((err) => err.msg)
        .join(". "),
      400
    );
  }

  const { username, email, profileName, bio } = req.body;
  let user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("Requested user not found.", 404);
  }

  if (username) user.username = username;
  if (email) user.email = email;
  if (profileName) user.profileName = profileName;
  if (bio) user.bio = bio;

  await user.save();
  const updatedUser = user.toObject();
  delete updatedUser.password;

  res.status(200).json({ updatedUser });
});

// Method to update password
exports.updateUserPassword= asyncHandler(async (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors
        .array()
        .map((err) => err.msg)
        .join(". "),
      400
    );
  }
  const {currentPassword,newPassword}= req.body;
  const user= await User.findById(req.user.id);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError("Invalid current password.", 401); 
  }
  
  if (currentPassword==newPassword) {
    throw new AppError("New password should be different from existing password.", 400); 
  }

  user.password=newPassword;
  const result= await user.save();
  if (result) {
    res.status(200).send("Password updated successfully.");
  }
});

// Method to send reset token to user to reset password via Forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors
        .array()
        .map((err) => err.msg)
        .join(". "),
      400
    );
  }
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
      throw new AppError('No account with that email address.', 404);
  }

  // Generate a token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Check if token already exists in database
  const existingToken = await PasswordResetToken.findOne({ user: user._id });

if (existingToken) {
    // Update the existing token and reset the expiry date
    existingToken.token = hash;
    existingToken.expiresAt = new Date(Date.now() + 30 * 60 * 1000);  // Expires after 30 mins from now
    await existingToken.save();
} else {
    // Create a new token if it doesn't exist
    const newToken = new PasswordResetToken({
        user: user._id,
        token: hash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // Expires after 30 mins from now
    });
    await newToken.save();
}

  // Send the reset token to the user via email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;
  sendPasswordResetEmail(user.email, resetUrl); 

  res.status(200).json({ message: 'Password reset email sent.' });
});

// Method to Reset password after form submission from Forgot Password
exports.resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors
        .array()
        .map((err) => err.msg)
        .join(". "),
      400
    );
  }

  const { token, newPassword } = req.body;
  const passwordResetToken = await PasswordResetToken.findOne({ token });
  if (!passwordResetToken) {
    return res.status(400).send('Invalid or expired password reset token');
  }

  // Find the user by the reset token
  const user = await User.findById(passwordResetToken.user);
  if (!user) {
    return res.status(400).send('Invalid user captured from token.');
  }

  // Update user's password
  user.password = newPassword;
  await user.save();

  // Remove password reset token
  await PasswordResetToken.findByIdAndDelete(passwordResetToken._id);

  res.send('Your password has been reset successfully. You can now login with your new password.');
});