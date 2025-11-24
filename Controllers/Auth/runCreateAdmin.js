const mongoose = require("mongoose");
const { createAdmin } = require("./CreateAdmin");

// Connect to MongoDB
const MONGO_URI =
  "mongodb+srv://boro:borocasino@cluster0-casino.ahk8ecv.mongodb.net/?appName=Cluster0-casino";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");
    await createAdmin(); // Run the function
    mongoose.disconnect(); // Close DB connection
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
