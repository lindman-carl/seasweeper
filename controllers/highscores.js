const bcrypt = require("bcrypt");

const highscoresRouter = require("express").Router();

const Highscore = require("../models/Highscore");

// cache highscores
let highscoresCache;
let highscoresCacheNeedsUpdate = true;

// get all highscores
highscoresRouter.get("/", async (req, res) => {
  if (highscoresCacheNeedsUpdate) {
    // find all highscores
    console.log("[highscores] updating cache...");
    const highscores = await Highscore.find({});
    highscoresCache = highscores;
    highscoresCacheNeedsUpdate = false;
  }

  // respond with json
  res.json(highscoresCache.map((highscore) => highscore.toJSON()));
});

// get highscore by id
highscoresRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  // find highscore by id
  const highscore = await Highscore.findById(id);

  // respond with json
  res.json(highscore.toJSON());
});

// create highscore
highscoresRouter.post("/", async (req, res) => {
  const { time, playerName, gameMode, hash } = req.body; // destructure request body

  const hashString = `${time}${gameMode}${playerName}${process.env.SECRET_KEY}`;

  if (!bcrypt.compareSync(hashString, hash)) {
    return res.status(400).json({ error: "invalid hash" });
  }

  // create new highscore object
  const newHighscoreObject = new Highscore({
    time,
    playerName,
    gameMode,
    timestamp: Date.now(),
  });

  // save to db, tell cache to update
  const savedHighscoreObject = await newHighscoreObject.save();
  highscoresCacheNeedsUpdate = true;

  console.log(`[highscores] posted ${savedHighscoreObject}`);

  // respond with saved object
  res.status(201).json(savedHighscoreObject);
});

// update highscore
highscoresRouter.put("/:id", async (req, res) => {
  const {
    body: { time, playerName },
    params: { id },
  } = req;

  const highscore = {
    time,
    playerName,
  };

  // update object
  const updatedHighscore = await Highscore.findByIdAndUpdate(id, highscore, {
    new: true,
  });

  // respond with the newly updated object
  res.status(200).json(updatedHighscore);
});

// delete highscore
highscoresRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // delete highscore
  const deletedHighscore = await Highscore.findByIdAndDelete(id);

  // respond with deleted object
  res.status(204).json(deletedHighscore.toJSON());
});

module.exports = highscoresRouter;
