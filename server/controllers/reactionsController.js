const Reaction = require("../models/Reaction");
const asyncHandler = require("express-async-handler");

exports.addOrUpdateReaction = asyncHandler(async (req, res) => {
    const { type, target, onModel } = req.body;
    const userId = req.user._id;
  
    // Check if the user has already reacted to the target
    let reaction = await Reaction.findOne({
      user: userId,
      target: target,
      onModel: onModel,
    });
  
    if (reaction) {
      // If a reaction exists, update it
      reaction.type = type;
      await reaction.save();
      res.status(200).json({ message: "Reaction updated successfully", reaction });
    } else {
      // If no reaction exists, create a new one
      reaction = new Reaction({
        type,
        target,
        onModel,
        user: userId,
      });
      await reaction.save();
      res.status(201).json({ message: "Reaction added successfully", reaction });
    }
  });
exports.removeReaction = asyncHandler(async (req, res) => {
  const { reactionId } = req.params;

  const result = await Reaction.findByIdAndDelete(reactionId);
  if (result) {
    res.status(204).send(); // No content to send back
  } else {
    res.status(404).json({ message: "Reaction not found" });
  }
});

exports.getReactionsForTarget = asyncHandler(async (req, res) => {
  const { targetId } = req.params;

  const reactions = await Reaction.find({ target: targetId });
  res.status(200).json(reactions);
});
