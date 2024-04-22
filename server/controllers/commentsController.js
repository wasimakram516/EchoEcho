const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");
const Reply=require("../models/Reply");

const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");

// Method to Add a new comment
exports.addComment = asyncHandler(async (req, res) => {
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

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("Invalid user.", 404);
  }

  // A 'post' is passed in the body of the request as the ID of the post
  const { text, post } = req.body;

  if (!mongoose.Types.ObjectId.isValid(post)) {
    throw new AppError("Invalid Post ID", 400);
  }

  // Create a new comment
  const newComment = new Comment({
    text: text,
    author: user._id,
    post: post,
  });

  // Save the comment
  await newComment.save();

  // Update the Post with the new comment
  const updatedPost = await Post.findByIdAndUpdate(
    post,
    { $push: { comments: newComment._id } },
    { new: true } // Returns the updated document
  );

  if (!updatedPost) {
    throw new AppError("Post not found.", 404);
  }

  // Return success response
  res.status(201).json({
    success: true,
    data: newComment,
    post: updatedPost,
  });
});

// Method to Update a comment
exports.updateComment = asyncHandler(async (req, res) => {
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

  const {  text } = req.body;
  const commentId= req.params.commentId;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new AppError("Invalid Comment ID", 400);
  }

  // Retrieve the comment to be updated
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.isDeleted) {
    throw new AppError("You can't update the deleted comment.", 400);
  }
  // Check if the user is the author of the comment
  if (!comment.author.equals(req.user.id)) {
    throw new AppError("User not authorized to update this comment", 403);
  }

  // Update the comment
  comment.text = text;
  await comment.save();

  // Return the updated comment
  res.status(200).json({
    success: true,
    data: comment,
  });
});

// Method to Delete a comment
exports.deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params; // Assuming the comment ID is sent as a URL parameter

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new AppError("Invalid Comment ID", 400);
  }

  // Retrieve the comment to be deleted
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  // Check if the user is the author of the comment
  if (!comment.author.equals(req.user.id)) {
    throw new AppError("User not authorized to delete this comment", 403);
  }

  // Check if the comment is already marked as deleted
  if (comment.isDeleted) {
    throw new AppError("Comment is already deleted", 400);
  }

  // Soft delete the comment: set isDeleted to true and record the deletion time
  comment.isDeleted = true;
  comment.deletedAt = new Date();
  await comment.save();

  // Return success response
  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
    comment:comment
  });
});

// Method to Get a single comment
exports.getComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new AppError("Invalid Comment ID", 400);
  }

  // Retrieve the comment considering the soft deletion status
  const comment = await Comment.findOne({
    _id: commentId,
    isDeleted: false,
  }).populate('author', 'username profileName') // 'author' is a reference to the User model
  .populate('post', 'content'); // 'post' is a reference to the Post model

  if (!comment) {
    throw new AppError("Comment not found or has been deleted", 404);
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
});


// Method to Get all comments for a specific post
exports.getCommentsForPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * pageSize;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new AppError("Invalid Post ID", 400);
  }

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .populate('author', 'username profileName')

  const adjustedComments = comments.map(comment => ({
    ...comment.toObject(),
    text: comment.isDeleted && (!comment.replies || comment.replies.length === 0) ? "This comment has been deleted" : comment.text,
    repliesCount: comment.replies ? comment.replies.length : 0
  }));

  res.status(200).json({
    success: true,
    totalComments: comments.length,
    page: page,
    totalPages: Math.ceil(comments.length / pageSize),
    data: adjustedComments,
  });
});