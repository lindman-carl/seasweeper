const mongoose = require("mongoose");

const dailySchema = mongoose.Schema({
  map: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  dateString: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  numBombs: {
    type: Number,
    required: true,
  },
  nLighthouses: {
    type: Number,
    required: true,
  },
});

dailySchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Daily = mongoose.model("Daily", dailySchema);

module.exports = Daily;
