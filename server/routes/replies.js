const express = require('express');
const { addReply, updateReply,getRepliesByComment, deleteReply, getReply } = require('../controllers/repliesController');
const {authUser} = require("../middleware/auth");
const {  newReplyValidations, UpdateReplyValidations } = require('../middleware/validationRules');

const router = express.Router();

// Route 1: Add a new Reply using method POST("/api/replies/"): Login required
router.post('/', [newReplyValidations,authUser], addReply);

// Route 2: Update Reply using method PUT("/api/replies/:replyId"): Login required
router.put('/:replyId', [UpdateReplyValidations,authUser], updateReply);

// Route 3: Get Replies of a comment using method GET("/api/replies/comment/:commentId"): Login required
router.get('/comment/:commentId', authUser, getRepliesByComment);

// Route 3: Get Replies of a comment using method GET("/api/replies/:replyId"): Login required
router.get('/:replyId', authUser, getReply);

// Route 4: Delete Reply using method DELETE("/api/replies/:replyId"): Login required
router.delete('/:replyId', [authUser], deleteReply);

module.exports = router;
