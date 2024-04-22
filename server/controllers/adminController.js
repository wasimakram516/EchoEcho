const User = require("../models/User");
const Post= require("../models/Post");

const asyncHandler = require("express-async-handler");

// Method to load all users
exports.loadAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ userType: "user" }).select("-password");

  res.status(200).json(users.length <= 0 ? "No users found." : users);
});

// Method to Get All Posts
exports.loadAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.aggregate([
      { $skip: skip },
      { $limit: limit },
      // Lookup to attach author details to each post
      {
          $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "authorDetails"
          }
      },
      { $unwind: { path: "$authorDetails", preserveNullAndEmptyArrays: true } },
      // Lookup for reactions on the post
      {
          $lookup: {
              from: "reactions",
              localField: "_id",
              foreignField: "target",
              as: "postReactions"
          }
      },
      // Lookup to attach comments to each post
      {
          $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "post",
              pipeline: [
                  {
                      $lookup: {
                          from: "users",
                          localField: "author",
                          foreignField: "_id",
                          as: "authorDetails"
                      }
                  },
                  { $unwind: { path: "$authorDetails", preserveNullAndEmptyArrays: true } },
                  // Lookup reactions for each comment
                  {
                      $lookup: {
                          from: "reactions",
                          localField: "_id",
                          foreignField: "target",
                          as: "commentReactions"
                      }
                  },
                  // Lookup to attach replies to each comment
                  {
                      $lookup: {
                          from: "replies",
                          localField: "_id",
                          foreignField: "parentComment",
                          as: "replies"
                      }
                  },
                  // Lookup author details for each reply
                  {
                      $lookup: {
                          from: "users",
                          localField: "replies.author",
                          foreignField: "_id",
                          as: "replies.authorDetails"
                      }
                  },
                  // Unwind the nested arrays to attach reactions to replies
                  { $unwind: { path: "$replies", preserveNullAndEmptyArrays: true } },
                  {
                      $lookup: {
                          from: "reactions",
                          localField: "replies._id",
                          foreignField: "target",
                          as: "replies.reactions"
                      }
                  },
                  { $unwind: { path: "$replies.authorDetails", preserveNullAndEmptyArrays: true } },
                  // Group replies back to their comments
                  {
                      $group: {
                          _id: "$_id",
                          root: { $first: "$$ROOT" },
                          replies: { $push: "$replies" }
                      }
                  },
                  {
                      $addFields: {
                          "root.replies": "$replies"
                      }
                  },
                  {
                      $replaceRoot: { newRoot: "$root" }
                  }
              ],
              as: "comments"
          }
      },
      // Projection to select necessary fields and exclude sensitive data
      {
          $project: {
              content: 1,
              authorDetails: {
                  _id: 1,
                  username: 1,
                  profileName: 1
              },
              postReactions: 1,
              comments: {
                  _id: 1,
                  text: 1,
                  authorDetails: {
                      _id: 1,
                      username: 1,
                      profileName: 1
                  },
                  commentReactions: 1,
                  replies: {
                      _id: 1,
                      text: 1,
                      createdAt: 1,
                      updatedAt: 1,
                      isDeleted: 1,
                      reactions: 1,
                      authorDetails: {
                          _id: 1,
                          username: 1,
                          profileName: 1
                      }
                  }
              }
          }
      }
  ]);

  const totalPosts = await Post.countDocuments();
  res.status(200).json({
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      posts: posts.length <= 0 ? "No posts found." : posts
  });
});

