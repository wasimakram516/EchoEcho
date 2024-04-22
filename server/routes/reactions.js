const express = require("express");
const router = express.Router();
const {authUser} = require("../middleware/auth");
const {
  removeReaction,
  getReactionsForTarget,
  addOrUpdateReaction,
} = require("../controllers/reactionsController");
const { reactionValidationRules } = require("../middleware/validationRules");

// POST or UPDATE a reaction
router.post("/",[reactionValidationRules,authUser], addOrUpdateReaction);

// DELETE a reaction
router.delete("/:reactionId", authUser, removeReaction);

// GET reactions for a specific target
router.get("/target/:targetId", authUser, getReactionsForTarget);

module.exports = router;
