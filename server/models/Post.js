const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    reactions: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reaction",
      },
  ],
});
postSchema.index({ author: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
