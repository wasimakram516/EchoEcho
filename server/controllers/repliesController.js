const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Reply = require("../models/Reply");
const Comment = require("../models/Comment");
const AppError = require("../utils/AppError");

// @desc Add a reply to a comment
// @route POST /api/replies
// @access Private

exports.addReply = asyncHandler(async (req, res) => {
  const { text, commentId } = req.body; // Assuming you're getting the comment ID and text from the body

  // You might want to validate commentId and text before this step
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  const reply = new Reply({
    text,
    author: req.user._id,
    parentComment: commentId,
  });

  await reply.save();

  // Optionally, push the reply to the parent comment's replies array
  const updatedComment = await Comment.findByIdAndUpdate(
    comment,
    { $push: { replies: reply._id } },
    { new: true } // Returns the updated document
  );
  await updatedComment.save();

  res.status(201).json({
    success: true,
    data: reply,
  });
});

// @desc Update a reply
// @route PUT /api/replies/:replyId
// @access Private

exports.updateReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(replyId)) {
    throw new AppError("Invalid Reply ID", 400);
  }

  const reply = await Reply.findById(replyId);

  if (!reply) {
    throw new AppError("Reply not found", 404);
  }

  if (reply.isDeleted) {
    throw new AppError("You can't update a deleted reply", 400);
  }
  
  if (reply.author.toString() !== req.user._id.toString()) {
    throw new AppError("User not authorized to update this reply", 403);
  }

  reply.text = text;
  await reply.save();

  res.status(200).json({
    success: true,
    data: reply,
  });
});

// @desc Get a single reply
// @route Get /api/replies/:replyId
// @access Private

exports.getReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(replyId)) {
    throw new AppError("Invalid Reply ID", 400);
  }

  // Retrieve the reply considering the soft deletion status
  const reply = await Reply.findOne({
    _id: replyId,
    isDeleted: false,
  })
    .populate("author", "username profileName") // 'author' is a reference to the User model
    .populate("parentComment", "text"); // 'parentComment' is a reference to the Comment model

  if (!reply) {
    throw new AppError("Reply not found or has been deleted", 404);
  }

  res.status(200).json({
    success: true,
    data: reply,
  });
});

// @desc Get all replies of a comment
// @route GET /api/replies/:commentid
// @access Private

exports.getRepliesByComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new AppError("Invalid Comment ID", 400);
  }

  const replies = await Reply.find({ parentComment: commentId }).populate(
    "author",
    "username profileName"
  );

  // Modify the reply text if it has been deleted
  const adjustedReplies = replies.map((reply) => ({
    ...reply.toObject(),
    text: reply.isDeleted ? "This reply has been deleted" : reply.text,
  }));

  res.status(200).json({
    success: true,
    data: adjustedReplies,
  });
});

// @desc Delete a reply
// @route DELETE /api/replies/:replyId
// @access Private

exports.deleteReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(replyId)) {
    throw new AppError("Invalid Reply ID", 400);
  }

  // Retrieve the reply to be deleted
  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new AppError("Reply not found", 404);
  }

  // Check if the user is the author of the reply
  if (!reply.author.equals(req.user.id)) {
    throw new AppError("User not authorized to delete this Reply", 403);
  }

  // Check if the reply is already marked as deleted
  if (reply.isDeleted) {
    throw new AppError("Reply is already deleted", 400);
  }

  // Soft delete the reply: set isDeleted to true and record the deletion time
  reply.isDeleted = true;
  reply.deletedAt = new Date();
  await reply.save();

  // Return success response
  res.status(200).json({
    success: true,
    message: "reply deleted successfully",
    reply: reply,
  });
});
