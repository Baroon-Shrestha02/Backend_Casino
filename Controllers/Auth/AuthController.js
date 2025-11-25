const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../Models/AdminModel");
const RefreshToken = require("../../Models/RefreshToken");

// =====================
// Helper Functions
// =====================
const createAccessToken = (admin) => {
  return jwt.sign(
    { adminId: admin._id, username: admin.username, role: "admin" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const createRefreshToken = (admin) => {
  return jwt.sign({ adminId: admin._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// =====================
// Admin Login
// =====================
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });

    const accessToken = createAccessToken(admin);
    const refreshToken = createRefreshToken(admin);

    // Save refresh token in DB
    const decoded = jwt.decode(refreshToken);
    await RefreshToken.create({
      userId: admin._id,
      token: refreshToken,
      expiresAt: new Date(decoded.exp * 1000),
    });

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true, // change to true in production (with HTTPS)
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      username: admin.username,
      role: "admin",
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// =====================
// Refresh Access Token
// =====================
const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });

    const stored = await RefreshToken.findOne({ token });
    if (!stored)
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ success: false, message: "Expired refresh token" });

        const admin = await Admin.findById(decoded.adminId);
        if (!admin)
          return res
            .status(404)
            .json({ success: false, message: "Admin not found" });

        const newAccessToken = createAccessToken(admin);

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({
          success: true,
          message: "Access token refreshed successfully",
        });
      }
    );
  } catch (error) {
    console.error("Refresh Access Token Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh access token",
      error: error.message,
    });
  }
};

// =====================
// Logout (Sign Out)
// =====================
const signOut = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    console.error("Sign Out Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sign out",
      error: error.message,
    });
  }
};

// =====================
// Get Admin Info
// =====================
const getAdmin = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    res.status(200).json({
      success: true,
      username: admin.username,
      role: admin.role || "admin",
      id: admin._id,
    });
  } catch (error) {
    console.error("Get Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get admin details",
      error: error.message,
    });
  }
};

module.exports = { adminLogin, refreshAccessToken, signOut, getAdmin };
