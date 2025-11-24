const mongoose = require("mongoose");

// PbhYavWnKJ7Bo0l0
const mongoDB_URI =
  process.env.URI ||
  "mongodb+srv://boro:borocasino@cluster0-casino.ahk8ecv.mongodb.net/?appName=Cluster0-casino";

const database = async () => {
  try {
    await mongoose.connect(mongoDB_URI);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { database };
