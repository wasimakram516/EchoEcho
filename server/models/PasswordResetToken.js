const mongoose = require("mongoose");

const PasswordResetTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
});

// This index will automatically delete documents from this collection when the `expiresAt` time has passed.
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetToken = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);
module.exports = PasswordResetToken;
