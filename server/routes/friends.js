const express = require("express");
const router = express.Router();
const {authUser} = require("../middleware/auth");
const { addFriendRequest, acceptFriendRequest, removeFriend, listFriends } = require("../controllers/friendsController");

// Route 1: Send a friend request
router.post("/requests", authUser, addFriendRequest);

// Route 2: Accept a friend request
router.post("/requests/accept", authUser, acceptFriendRequest);

// Route 3: Remove a friend
router.delete("/:friendId", authUser, removeFriend);

// Route 4: List all friends
router.get("/", authUser, listFriends);

module.exports = router;
