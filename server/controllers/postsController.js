const AppError = require("../utils/AppError");
const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

// Method to create a new Post
exports.createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors.array().map((err) => err.msg),
      400
    );
  }
  const user = req.user;
  let { content } = req.body;
  const authorName = user.profileName;
  const fullContent = `${content}, By: ${authorName}`;
  const post = new Post({
    content: fullContent,
    author: user.id,
  });
  await post.save();
  res.status(201).json(post);
});

// Method to Get Posts of a user
exports.getUsersPosts = asyncHandler(async (req, res) => {
  const user = req.user;

  const posts = await Post.find({ author: user.id });
  res.status(200).json(posts);
});

// Method to Get a single Posts based on Post ID
exports.getSinglePost = asyncHandler(async (req, res) => {
  const posts = await Post.findById(req.params.postId);
  res.status(200).json(posts);
});

// Method to Get Friends Posts
exports.getFriendsPosts = asyncHandler(async (req, res) => {
  // Assuming `req.user._id` is available through your authentication middleware
  const userId = req.user._id;

  // Find the user to get their list of friends
  const user = await User.findById(userId).populate("friends");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Extract friend IDs, assuming `friends` is populated correctly
  const friendIds = user.friends.map((friend) => friend._id);

  // Find posts made by user's friends
  const posts = await Post.find({
    author: { $in: friendIds },
  }).populate("author", "username profileName"); // Populate author details if needed

  const postsData = posts.length <= 0 ? "No posts to display." : posts;

  res.status(200).json({
    success: true,
    data: postsData,
  });
});

// Method to update a post
exports.updatePost = asyncHandler(async (req, res) => {
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

  const { content } = req.body;
  const postId = req.params.postId;

  const post = await Post.findById(postId);

  // Check if post exists
  if (!post) {
    throw new AppError("Post not found.", 404);
  }

  // updated the post
  post.content = content;

  await post.save();
  res.status(200).json(post);
});

// Method to delete a post
exports.deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.findByIdAndDelete(postId);

  // Check if post exists
  if (!post) {
    throw new AppError("Post not found.", 404);
  }

  res.status(200).json("Post deleted successfully.");
});
