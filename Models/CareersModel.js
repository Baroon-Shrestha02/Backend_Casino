const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
    },

    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract"],
      required: true,
    },

    salary: {
      type: String,
      required: false, // make optional if needed
    },

    image: [
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

    highlights: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      default: "Entry Level",
    },

    deadline: {
      type: String,
      required: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Careers = mongoose.model("Careers", CareerSchema);

module.exports = Careers;
