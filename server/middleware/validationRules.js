const { body } = require("express-validator");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const mongoose= require("mongoose");

// USERS
exports.newUserValidationRules = [
  body("username", "Enter a valid username")
    .trim()
    .isLength({ min: 3, max: 30 }),
  body("username").custom(async (username) => {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new AppError("Username already exists", 400);
    }
  }),
  body("email", "Enter a valid email").isEmail().normalizeEmail(),
  body("email").custom(async (email) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }
  }),
  body("password", "Password must have 8 characters")
    .trim()
    .isLength({ min: 8 }),
  body("profileName", "Enter a valid Name")
    .trim()
    .isLength({ min: 3, max: 50 }),
  body("bio", "Bio cannot exceed 255 characters").trim().isLength({ max: 255 }),
];

exports.updatedUserValidationRules = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Enter a valid username")
    .custom(async (username, { req }) => {
      if (!username) return true; 
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new AppError("Username already exists", 400);
      }
    }),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail()
    .custom(async (email, { req }) => {
      if (!email) return true; 
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError("Email already in use", 400);
      }
    }),
  body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must have 8 characters"),
  body("profileName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Enter a valid Name"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Bio cannot exceed 255 characters"),
];

exports.loginValidationRules = [
  body("email", "Enter a valid email.").isEmail().normalizeEmail(),
  body("password", "Invalid Credentials.").trim().isLength({ min: 8 }),
];

exports.updatePasswordValidation = [
  body("newPassword", "Password must have minimum 8 characters.")
    .trim()
    .isLength({ min: 8 }),
];

exports.forgotPasswordValidation = [
  body("email", "Enter a valid email").isEmail().normalizeEmail(),
];

exports.resetPasswordValidation = [
  body("token").not().isEmpty().withMessage("Token is required."),
  body("newPassword")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

// POSTS
exports.postValidations = [
  body(
    "content",
    "Enter something to post. Content must have maximum 255 characters."
  )
    .isLength({ min: 1, max: 255 })
    .trim(),
];

// COMMENTS
exports.newCommentValidations = [
  body("text", "Enter something to comment up to 255 characters.")
    .trim()
    .isLength({ min: 1, max: 255 }),
  body("post", "Post ID is required and must be a valid MongoDB ObjectID.")
    .not().isEmpty()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Post ID must be a valid MongoDB ObjectID.")
];

exports.UpdateCommentValidations = [
  body("text", "Enter something to comment up to 255 characters.")
    .trim()
    .isLength({ min: 1, max: 255 })
];

// REPLIES
exports.newReplyValidations = [
  body("text", "Enter something to comment up to 255 characters.")
    .trim()
    .isLength({ min: 1, max: 255 }),
  body("commentId", "Comment ID is required and must be a valid MongoDB ObjectID.")
    .not().isEmpty()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Comment ID must be a valid MongoDB ObjectID.")
];

exports.UpdateReplyValidations = [
  body("text", "Enter something to comment up to 255 characters.")
    .trim()
    .isLength({ min: 1, max: 255 })
];

// REACTIONS
exports.reactionValidationRules = [
  body('type', 'Invalid type of reaction. Allowed types are like, love, haha, wow, sad, angry.')
    .exists().withMessage('Reaction type is required.')
    .isIn(['like', 'love', 'haha', 'wow', 'sad', 'angry']).withMessage('Invalid reaction type provided.'),

  body('target', 'Target is required and must be a valid MongoDB ObjectId.')
    .exists().withMessage('Target is required.')
    .isMongoId().withMessage('Target must be a valid MongoDB ObjectId.'),

  body('onModel', 'onModel must be either Post or Comment.')
    .exists().withMessage('onModel is required.')
    .isIn(['Post', 'Comment']).withMessage('onModel must be either Post or Comment.')
];