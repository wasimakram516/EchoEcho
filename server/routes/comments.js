const express = require("express");
const {
  addComment,
  updateComment,
  deleteComment,
  getComment,
  getCommentsForPost,
} = require("../controllers/commentsController");
const {
  newCommentValidations,
  UpdateCommentValidations,
} = require("../middleware/validationRules");
const {authUser}=require("../middleware/auth");

const router = express.Router();

// Route 1: Add a new comment using method POST("/api/comments/addComment"): Login required
router.post("/", [newCommentValidations, authUser], addComment);

// Route 2: Update a comment using method POST("/api/comments/updateComment/:commentId"): Login required
router.put("/:commentId", [UpdateCommentValidations, authUser], updateComment);

// Route 3: Delete a comment using method DELETE("/api/comments/deleteComment/:commentId"): Login required
router.delete("/:commentId", [authUser], deleteComment);

// Route 4: Get a comment using method GET("/api/comments/getComment/:commentId"): Login required
router.get("/:commentId", [authUser], getComment);

// Route 5: Get All comments of post using method GET("/api/comments/getCommentsForPost/:postId"): Login required
router.get("/post/:postId", [authUser], getCommentsForPost);

module.exports = router;
