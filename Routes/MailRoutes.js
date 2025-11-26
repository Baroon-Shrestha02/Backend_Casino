const express = require("express");
const { sendJobApplicationMail } = require("../Controllers/CVController");

const router = express.Router();

router.post("/send-mail", sendJobApplicationMail);
// router.post("/send-cv", sendCV);

module.exports = router;
