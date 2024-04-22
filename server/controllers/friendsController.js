const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");

// Helper method adjusted to throw errors directly
const checkUserExistence = asyncHandler(async (userId, friendId) => {
  const currentUser = await User.findById(userId);
  const friendToAdd = await User.findById(friendId);
  if (!currentUser) {
    throw new AppError("Current user was not found.", 404);
  }
  if (!friendToAdd) {
    throw new AppError("Friend to add was not found.", 404);
  }
  if (currentUser._id.equals(friendId)) {
    throw new AppError("You cannot add yourself as a friend.", 400);
  }
  return { currentUser, friendToAdd };
});

// Method to add new friends
exports.addFriendRequest = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { friendID } = req.body;

  const { currentUser, friendToAdd } = await checkUserExistence(
    userId,
    friendID
  );

  if (
    currentUser.sentFriendRequests.includes(friendID) ||
    currentUser.receivedFriendRequests.includes(friendID)
  ) {
    throw new AppError("Already requested or received a friend request", 400);
  }

  currentUser.sentFriendRequests.push(friendID);
  friendToAdd.receivedFriendRequests.push(userId);

  await currentUser.save();
  await friendToAdd.save();
  res.status(201).json({ message: "Friend request sent successfully" });
});

// Method to accept friend request
exports.acceptFriendRequest = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { friendID } = req.body;

  const { currentUser, friendToAdd } = await checkUserExistence(
    userId,
    friendID
  );

  if (!currentUser.receivedFriendRequests.includes(friendID)) {
    throw new AppError("No friend request to accept", 400);
  }

  // Add each other to friends lists
  currentUser.friends.push(friendID);
  friendToAdd.friends.push(userId);

  // Remove from received and sent friend requests
  currentUser.receivedFriendRequests.pull(friendID);
  friendToAdd.sentFriendRequests.pull(userId);

  await currentUser.save();
  await friendToAdd.save();

  res.status(200).json({ message: "Friend added successfully" });
});

// Method to remove a friend
exports.removeFriend = asyncHandler(async (req, res) => {
  const userId = req.user;
  const friendID  = req.params.friendId;

  // Using the helper function to retrieve users
  const { currentUser, friendToAdd } = await checkUserExistence(
    res,
    userId,
    friendID
  );

  // Ensure this is a valid friend request to accept
  if (!currentUser.friends.includes(friendID)) {
    throw new AppError("Not a fried.", 404);
  }

  // Remove each other from friends lists
  currentUser.friends.pull(friendID);
  friendToAdd.friends.pull(userId);

  // Save changes to both user documents
  await currentUser.save();
  await friendToAdd.save();

  res.status(200).json({ message: "Friend removed successfully" });
});

// Method to load all friends of a specific user
exports.listFriends = asyncHandler(async (req, res) => {
  const userId = req.user;

  // To filter the fields to be displayed: Filter name and picture of friends from friends array of current user
  const friendsOfUser = await User.findById(userId).populate({
    path: "friends",
    select: "profileName profilePicture",
  });
  let friends = friendsOfUser.friends;
  friends = friends.length == 0 ? "No Friends." : friends;
  res.status(200).json(friends);
});
