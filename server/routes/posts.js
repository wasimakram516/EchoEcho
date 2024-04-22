const express = require("express");
const router = express.Router();
const {authUser} = require("../middleware/auth");
const { createPost, getUsersPosts, getSinglePost, updatePost, deletePost, getFriendsPosts } = require("../controllers/postsController");
const { postValidations } = require("../middleware/validationRules");

// Route to create a new post
router.post("/", [postValidations, authUser], createPost);

// Route to update a specific post
router.put("/:postId", [postValidations, authUser], updatePost);

// Route to delete a specific post
router.delete("/:postId", authUser, deletePost);

// Route to get a single post by its ID
router.get("/:postId", authUser, getSinglePost);

// Route to get posts by a specific user
router.get("/user/:userId", authUser, getUsersPosts);

// Route to get all posts
router.get("/", authUser, getFriendsPosts);

module.exports = router;
