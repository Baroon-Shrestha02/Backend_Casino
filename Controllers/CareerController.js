const {
  uploadImages,
  deleteCloudinaryFiles,
} = require("../Helper/ImageUploader");

const careers = require("../Models/CareersModel");

const normalizeArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((val) => val.length > 0);
  }

  return [];
};

const addPost = async (req, res) => {
  try {
    const {
      title,
      location,
      type,
      salary,
      description,
      experience,
      deadline,
      isActive,
    } = req.body;

    const { role } = req.user;

    if (role != "admin")
      return res.status(403).send("Unauthorized! Only admin are allowed");

    const highlightsArray = normalizeArray(req.body["highlights[]"]);
    const requirementsArray = normalizeArray(req.body["requirements[]"]);
    const benefitsArray = normalizeArray(req.body["benefits[]"]);

    let image = [];

    if (req.files && req.files.image) {
      const uploaded = await uploadImages(req.files.image);
      image = Array.isArray(uploaded) ? uploaded : [uploaded];
    }

    const newPost = await careers.create({
      title,
      location,
      type,
      salary,
      image,
      highlights: highlightsArray,
      description,
      requirements: requirementsArray,
      benefits: benefitsArray,
      experience,
      deadline,
      isActive: isActive ?? true,
    });

    res.status(201).json({
      success: true,
      message: "Career post added successfully",
      data: newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add post",
      error: error.message,
    });
  }
};

const getPost = async (req, res) => {
  try {
    const jobs = await careers.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).send("Post not found");

    const findPost = await careers.findById(id);

    res.status(200).json({
      success: true,
      findPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get post",
      error: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
};

const changeActive = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { role } = req.user;

    if (role != "admin")
      return res.status(403).send("Unauthorized! Only admin are allowed");

    const { id } = req.params;

    if (!id) return res.status(400).send("Post With Id not found");

    // Find the review
    const findPost = await careers.findById(id);

    if (!findPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // ✅ Delete any uploaded images from Cloudinary
    if (findPost.image && findPost.image.length > 0) {
      await deleteCloudinaryFiles(findPost.image);
    }

    // ✅ Delete the review from MongoDB
    await careers.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
};

module.exports = { addPost, getPost, getSinglePost, deletePost };
