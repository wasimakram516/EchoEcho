const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");

const generateTokens = async (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '5d' });
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Save the refresh token
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const newRefreshToken = new RefreshToken({
        token: refreshToken,
        user: userId,
        expiryDate: expiryDate
    });
    await newRefreshToken.save();

    return { accessToken, refreshToken };
};

module.exports = { generateTokens };
