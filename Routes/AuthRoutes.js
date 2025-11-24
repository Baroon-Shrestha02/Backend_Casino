const express = require("express");
const {
  adminLogin,
  signOut,
  refreshAccessToken,
} = require("../Controllers/Auth/AuthController");

const router = express.Router();

router.post("/login", adminLogin);
router.post("/refresh", refreshAccessToken);
router.post("/logout", signOut);

module.exports = router;
