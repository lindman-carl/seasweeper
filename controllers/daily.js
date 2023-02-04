const { generateValidIslandsMap } = require("../utils/islandMapGenerator");
const Daily = require("../models/Daily");

const dailyRouter = require("express").Router();

// combinations of island generation parameters
// [nIslands, clusterSpread]
const generationCombos = [
  [3, 10],
  [6, 2],
  [6, 4],
  [10, 2],
  [10, 4],
  [20, 2],
];
const lighthouseOptions = [0, 1, 2, 3];

// get a random element from an array
const randomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

// flatten 2d map to string
const mapToString = (map) => {
  let results = "";
  for (const row of map) {
    let rowString = row.join("");
    results += rowString;
  }
  return results;
};

// zero-pad a number, if it's less than 10
const zeroPad = (num) => (num < 10 ? `0${num}` : num);

// get the current date as a string
// "YYYY-MM-DD" zero-padded, e.g. "2020-01-01", day and month is 1-indexed
const getDateString = (date) =>
  `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(
    date.getDate()
  )}`;

// get the current daily map
dailyRouter.get("/", async (_, res) => {
  // query the db for the daily map with the most recent timestamp
  const dailyMap = await Daily.findOne().sort({ timestamp: -1 });

  if (dailyMap === null) {
    return res.status(400).json({ error: "daily map not found" });
  }

  res.status(200).json(dailyMap);
});

// GET daily map by date string
dailyRouter.get("/:dateString", async (req, res) => {
  const { dateString } = req.params;

  const dailyMap = await Daily.findOne({ dateString });

  if (dailyMap === null) {
    return res.status(400).json({ error: `${dateString} not found` });
  }

  res.status(200).json(dailyMap);
});

// schedule a cron task to generate a new map every 24 hours
dailyRouter.post("/", async (req, res) => {
  const { key } = req.headers;

  if (key !== process.env.DAILY_KEY) {
    return res.status(400).json({ error: "illegal request" });
  }

  // check if a daily map already exists for today
  // get the date and make it a string: "DD-MM-YYYY"
  const date = new Date();
  const dateString = getDateString(date);
  const timestamp = date.getTime();

  const dailyMap = await Daily.findOne({ dateString });
  if (dailyMap !== null) {
    console.log(dailyMap);
    return res.status(400).json({ error: `${dateString} already exists` });
  }

  // generate the new map
  const width = 20;
  const height = 20;
  const [nIslands, clusterSpread] = randomElement(generationCombos);
  const waterRatio = 0.6;
  const numBombs = 32;
  const nLighthouses = randomElement(lighthouseOptions);
  const newMap = generateValidIslandsMap(
    width,
    height,
    nIslands,
    clusterSpread,
    waterRatio,
    false
  );
  const mapString = mapToString(newMap);

  // create a new daily object and save it to the db
  const newDaily = new Daily({
    map: mapString,
    width,
    height,
    dateString,
    timestamp,
    numBombs,
    nLighthouses,
  });
  const savedDaily = await newDaily.save();

  console.log(
    `[server] generated a new daily map ${savedDaily.dateString}: ${savedDaily}`
  );

  return res
    .status(200)
    .json({ message: "successfully generated a new daily map" });
});

module.exports = dailyRouter;
