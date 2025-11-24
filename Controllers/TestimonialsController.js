const {
  uploadFiles,
  deleteCloudinaryFiles,
  uploadImages,
} = require("../Helper/ImageUploader");
const Testimonials = require("../Models/TestimonialsModels");

const addReview = async (req, res) => {
  try {
    const { name, description, rating } = req.body;

    if (!name || !description || !rating)
      return res.status(400).send("You cannot leave any of these empty");

    let profImg = [];

    // ✅ If an image is uploaded
    if (req.files && req.files.profImg) {
      const uploaded = await uploadImages(req.files.profImg);
      profImg = Array.isArray(uploaded) ? uploaded : [uploaded];
    } else {
      // ✅ Default profile image if none is uploaded
      profImg = [
        {
          public_id: "default_profile_image",
          url: "https://res.cloudinary.com/dbwu2fxcs/image/upload/v1762591657/default_pp_xifury.jpg",
          resource_type: "image",
        },
      ];
    }

    const newData = await Testimonials.create({
      name,
      description,
      rating,
      profImg,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial added successfully",
      data: newData,
    });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add testimonial",
      error: error.message,
    });
  }
};

// controllers/testimonialController.js
// controllers/testimonialController.js
const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const total = await Testimonials.countDocuments();

    const allData = await Testimonials.find()
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, 30)); // Only latest 30 testimonials max

    res.status(200).json({
      success: true,
      total,
      data: allData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role != "admin")
      return res.status(403).send("Unauthorized! Only admin are allowed");

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Review ID is required.",
      });
    }

    // Find the review
    const review = await Testimonials.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // ✅ Delete any uploaded images from Cloudinary
    if (review.profImg && review.profImg.length > 0) {
      await deleteCloudinaryFiles(review.profImg);
    }

    // ✅ Delete the review from MongoDB
    await Testimonials.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review.",
      error: error.message,
    });
  }
};
module.exports = { addReview, getAll, deleteReview };
