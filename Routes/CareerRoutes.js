const express = require("express");
const {
  getPost,
  addPost,
  getSinglePost,
  deletePost,
} = require("../Controllers/CareerController");
const { verifyAdmin } = require("../Helper/VerifyUser");

const router = express.Router();

router.get("/get-posts", getPost);
router.post("/add-posts", verifyAdmin, addPost);
router.get("/posts/:id", getSinglePost);
router.delete("/delete-posts/:id", verifyAdmin, deletePost);

module.exports = router;
