const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const compression = require("compression");
require("express-async-errors");

// utils
const config = require("./utils/config");
// routers
const highscoresRouter = require("./controllers/highscores");

const app = express(); // initialize express app

console.log("connecting to", config.MONGODB_URI); // log mongodb uri

// connect to mongodb
// test
const connectDB = () =>
  mongoose
    .connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
      console.log("connected to MongoDB");
    })
    .catch((error) => {
      console.error("error connection to MongoDB:", error.message);
    });

// middleware
app.use(
  cors({
    origin: "https://seasweeper.lindman.dev",
    methods: ["POST"],
    allowedHeaders: "appliction/json",
  })
);
app.use(express.static("build"));
app.use(express.json());
app.use(compression());

// routers
app.use("/api/highscores", highscoresRouter);
app.get("/*", function (_, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = { app, connectDB };
