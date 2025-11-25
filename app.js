require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mail = require("./Routes/MailRoutes");
const test = require("./Routes/TestimonialsRoute");
const auth = require("./Routes/AuthRoutes");
const career = require("./Routes/CareerRoutes");
const gallery = require("./Routes/GalleryRoutes");
const cookieParser = require("cookie-parser");
const { database } = require("./Database/database");

const app = express();

// Enable CORS for all origins
const allowedOrigins = [
  "https://casinotrainingnepal.com",
  "https://www.casinotrainingnepal.com",
  "http://localhost:5173",
  "https://frontend-casino-five.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running and CORS is configured ✅");
});

database();

app.use("/casino", mail);
app.use("/casino", test);
app.use("/casino", auth);
app.use("/casino", career);
app.use("/casino", gallery);

module.exports = app;
