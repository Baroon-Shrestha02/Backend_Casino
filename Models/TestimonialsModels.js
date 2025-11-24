const mongoose = require("mongoose");

const TestimonialsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, unique: true, trim: true },
    rating: { type: Number, required: true },
    profImg: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
          default:
            "https://res.cloudinary.com/dbwu2fxcs/image/upload/v1762591657/default_pp_xifury.jpg",
        },
      },
    ],
  },
  { timestamps: true }
);

const Testimonials = mongoose.model("Testimonials", TestimonialsSchema);

module.exports = Testimonials;
