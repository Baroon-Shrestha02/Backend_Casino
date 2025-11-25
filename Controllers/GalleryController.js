const { uploadImages } = require("../Helper/ImageUploader");
const Gallery = require("../Models/GalleryModel");

const getImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Images fetched successfully",
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
      error: error.message,
    });
  }
};

const addImages = async (req, res) => {
  try {
    // files coming from express-fileupload or multer
    const files = req.files?.image;

    if (!files) {
      return res.status(400).json({
        success: false,
        message: "No images provided",
      });
    }

    const fileArray = Array.isArray(files) ? files : [files];

    const docsToInsert = [];

    for (const file of fileArray) {
      const uploaded = await uploadImages(file);

      docsToInsert.push({
        alt: Date.now().toString(), // or req.body.alt if single upload alt
        image: [
          {
            public_id: uploaded.public_id,
            url: uploaded.url,
          },
        ],
        type: uploaded.resource_type,
      });
    }

    const savedDocs = await Gallery.insertMany(docsToInsert);

    return res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data: savedDocs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload images",
      error: error.message,
    });
  }
};

const deleteImages = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedImage = await Gallery.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: deletedImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

module.exports = { addImages, getImages, deleteImages };
