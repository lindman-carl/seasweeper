const mongoose = require("mongoose");

const leaderboardSchema = mongoose.Schema({
  playerName: {
    type: String,
    required: true,
  },
  goldMedals: {
    type: Number,
    required: true,
  },
  silverMedals: {
    type: Number,
    required: true,
  },
  bronzeMedals: {
    type: Number,
    required: true,
  },
});

leaderboardSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

module.exports = Leaderboard;
