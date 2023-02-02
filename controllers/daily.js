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

// get the current date as a string
// "DD-MM-YYYY" not zero-padded, month is 1-indexed
const getDateString = (date) =>
  `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

// get the current daily map
dailyRouter.get("/", async (req, res) => {
  // query the db for the daily map by the date string
  const dateString = getDateString();

  const dailyMap = await Daily.findOne({ dateString });

  if (dailyMap === null) {
    return res.status(400).json({ error: "daily map not found" });
  }

  res.status(200).json(dailyMap);
});

// schedule a cron task to generate a new map every 24 hours
dailyRouter.post("/", async (req, res) => {
  const { key } = req.headers;

  if (key !== process.env.DAILY_KEY) {
    return res.status(400).json({ error: "illegal request" });
  }

  // generate the new map
  const width = 20;
  const height = 20;
  const [nIslands, clusterSpread] = randomElement(generationCombos);
  const waterRatio = 0.6;
  const newMap = generateValidIslandsMap(
    width,
    height,
    nIslands,
    clusterSpread,
    waterRatio,
    false
  );
  const mapString = mapToString(newMap);

  // get the date and make it a string: "DD-MM-YYYY"
  const date = new Date();
  const dateString = getDateString(date);
  const timestamp = date.getTime();

  // create a new daily object and save it to the db
  const newDaily = new Daily({
    map: mapString,
    width,
    height,
    dateString,
    timestamp,
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
