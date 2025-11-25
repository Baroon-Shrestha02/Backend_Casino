const express = require("express");
const {
  getImages,
  addImages,
  deleteImages,
} = require("../Controllers/GalleryController");

const router = express.Router();

router.get("/get-images", getImages);
router.post("/add-images", addImages);
router.delete("/delete-images/:id", deleteImages);

module.exports = router;
