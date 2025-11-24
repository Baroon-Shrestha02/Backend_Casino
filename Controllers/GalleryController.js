const Gallery = require("../Models/GalleryModel");

const getImages = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Images",
      error: error.message,
    });
  }
};

const addImages = async (req, res) => {
  try {
    const allData = await Gallery.find().sort({ createdAt: -1 });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add images",
      error: error.message,
    });
  }
};

const deleteImages = async (req, res) => {
  try {
  } catch (error) {}
};
