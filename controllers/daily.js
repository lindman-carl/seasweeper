const { generateValidIslandsMap } = require("../utils/islandMapGenerator");
const {
  generationCombos,
  lighthouseOptions,
  mapToString,
  randomElement,
  getDateString,
} = require("./dailyUtils");
const Daily = require("../models/Daily");

const dailyRouter = require("express").Router();

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
    return res.status(403).json({ error: "illegal request" });
  }

  // check if a daily map already exists for today
  // get the date and make it a string: "DD-MM-YYYY"
  const date = new Date();
  const dateString = getDateString(date);
  const timestamp = date.getTime();

  console.log(date, dateString);

  const dailyMap = await Daily.findOne({ dateString });
  if (dailyMap !== null) {
    console.log(dailyMap);
    return res.status(400).json({ error: `${dateString} already exists` });
  }

  console.log(`[daily] generating a new daily map for ${dateString}...`);
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
