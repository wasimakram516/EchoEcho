const express = require("express");
const connectDB = require("./config/db");
const config = require("./config");
const cors = require("cors");
// Routes
const admin =require("./routes/admin")
const users = require("./routes/users");
const friends = require("./routes/friends");
const posts = require("./routes/posts");
const comments = require("./routes/comments");
const replies = require("./routes/replies");
const reactions= require("./routes/reactions");

// Error Handling middleware
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");

// Connect to database
connectDB();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // For parsing application/json

// Route setup with corrected paths
app.use("/api/admin", admin);
app.use("/api/users", users);
app.use("/api/friends", friends);
app.use("/api/posts", posts);
app.use("/api/comments", comments);
app.use("/api/replies", replies);
app.use("/api/reactions", reactions);

// Global error handler
app.use(errorHandlerMiddleware);

// Start server with dynamic port based on environment
app.listen(config.app.port, () => {
  console.log(
    `EchoEcho Server running on port ${config.app.port} in ${process.env.NODE_ENV} mode`
  );
});
