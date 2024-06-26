const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
    }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true } // it will automatically add createdAt and updatedAt feilds
);

CommentSchema.index({ post: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
