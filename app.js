const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const compression = require("compression");
require("express-async-errors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

// utils
const config = require("./utils/config");
// routers
const highscoresRouter = require("./controllers/highscores");
const dailyRouter = require("./controllers/daily");

const app = express(); // initialize express app

console.log("connecting to", config.MONGODB_URI); // log mongodb uri

// connect to mongodb
const connectDB = () =>
  mongoose
    .connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
      console.log("connected to MongoDB");
    })
    .catch((error) => {
      console.error("error connection to MongoDB:", error.message);
    });

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: true,
});

// middleware
app.use(helmet());
app.use(
  cors({
    origin: "https://seasweeper.lindman.dev",
    methods: ["GET", "POST"],
    allowedHeaders: "appliction/json",
    maxAge: 5,
  })
);
app.use(express.static("build"));
app.use(express.json());
app.use(compression());
app.use(mongoSanitize());
app.use("/api", apiLimiter);

// routers
app.use("/api/highscores", highscoresRouter);
app.use("/api/daily", dailyRouter);

app.get("/*", function (_, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = { app, connectDB };
