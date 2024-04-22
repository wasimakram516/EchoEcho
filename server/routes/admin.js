const express = require("express");
const router = express.Router();
const { loadAllUsers, loadAllPosts } = require("../controllers/adminController");
const { authAdmin, authUser } = require("../middleware/auth");

  // Load all users 
  router.get("/users",[authUser,authAdmin],loadAllUsers);
  
// Route to get all posts
router.get("/posts", [authUser,authAdmin], loadAllPosts);
  module.exports=router