const highscoresRouter = require("express").Router();

const Highscore = require("../models/HighScore");

// get all highscores
highscoresRouter.get("/", async (req, res) => {
  // find all highscores
  const highscores = await Highscore.find({});

  // respond with json
  res.json(highscores.map((highscore) => highscore.toJSON()));
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
  const { time, playerName } = req.body; // destructure request body

  // create new highscore object
  const newHighscoreObject = new Highscore({
    time,
    playerName,
  });

  // save to db
  const savedHighscoreObject = await newHighscoreObject.save();

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
