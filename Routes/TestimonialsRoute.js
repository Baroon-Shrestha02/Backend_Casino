const express = require("express");
const {
  getAll,
  addReview,
  deleteReview,
} = require("../Controllers/TestimonialsController");
const { verifyAdmin } = require("../Helper/VerifyUser");

const router = express.Router();

router.get("/testimonials", getAll);
router.post("/add", addReview);
router.delete("/delete/:id", verifyAdmin, deleteReview);

module.exports = router;
