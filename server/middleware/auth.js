const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;
const asyncHandler = require("express-async-handler");

// Extended authUser Middleware
const authUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: No token provided.", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AppError("Unauthorized: Malformed token.", 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select(
      "_id profileName userType"
    );
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    req.user = user;
    console.log("Logged in user: ", req.user);
    next();
  } catch (error) {
    throw new AppError("Unauthorized: Invalid token.", 401);
  }
});

// adminAuth Middleware
const authAdmin = (req, res, next) => {
  if (req.user.userType!="admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { authUser, authAdmin };
