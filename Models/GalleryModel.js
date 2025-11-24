const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    alt: { type: String, required: true, unique: true, trim: true },
    profImg: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    type: { type: String, default: "image", enum: ["video", "image"] },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", GallerySchema);

module.exports = Gallery;
