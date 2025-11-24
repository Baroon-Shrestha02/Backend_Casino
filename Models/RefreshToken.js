const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date },
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
