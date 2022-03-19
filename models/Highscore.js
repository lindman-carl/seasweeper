const mongoose = require("mongoose");

const highscoreSchema = mongoose.Schema({
  time: {
    type: Number,
    required: true,
  },
  playerName: {
    type: String,
    required: true,
  },
  gameMode: {
    type: String,
  },
  timestamp: {
    type: Number,
    required: true,
  },
});

highscoreSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Highscore = mongoose.model("Highscore", highscoreSchema);

module.exports = Highscore;
