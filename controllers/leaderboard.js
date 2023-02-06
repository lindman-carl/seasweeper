const leaderboardRouter = require("express").Router();
const Leaderboard = require("../models/Leaderboard");
const Highscore = require("../models/Highscore");
const { getDateString } = require("./dailyUtils");

let leaderboardCache = [];
let leaderboardCacheNeedsUpdate = true;

leaderboardRouter.get("/", async (_, res) => {
  // fetch leaderboard from db if cache is empty or needs update
  if (
    leaderboardCacheNeedsUpdate ||
    Object.keys(leaderboardCache).length === 0
  ) {
    console.log("[leaderboard] fetching leaderboard from db...");
    try {
      const leaderboard = await Leaderboard.find({}).sort({ medalScore: -1 });
      leaderboardCache = leaderboard;
      leaderboardCacheNeedsUpdate = false;
    } catch (error) {
      console.log("[leaderboard] error fetching leaderboard from db", error);
    }
  }

  // return leaderboard from cache
  res.status(200).json(leaderboardCache);
});

// count the medals from the daily challenge and update the leaderboard
// cron job runs this every day at midnight +1
leaderboardRouter.post("/", async (req, res) => {
  const { key } = req.headers;

  if (key !== process.env.DAILY_KEY) {
    return res.status(403).json({ error: "illegal request" });
  }

  // query the db for the top three highscores yesterdays daily challenge
  const yesterdayDateString = getDateString(new Date(Date.now() - 86400000));
  const yesterdayTopThree = await Highscore.find({
    gameMode: yesterdayDateString,
  })
    .limit(3)
    .sort({ time: 1 });

  console.log(
    `[leaderboard] ${yesterdayDateString} top three, ${yesterdayTopThree}`
  );

  // update the leaderboard
  // iterate over the top three highscores and update the appropriate medal count
  for (let i = 0; i < yesterdayTopThree.length; i++) {
    const highscore = yesterdayTopThree[i];
    console.log(
      `[leaderboard] updating rank ${i + 1}: ${
        highscore.playerName
      } medal count...`
    );

    switch (i) {
      case 0:
        await Leaderboard.findOneAndUpdate(
          { playerName: highscore.playerName },
          { $inc: { goldMedals: 1, medalScore: 3 } },
          { upsert: true }
        );
        break;
      case 1:
        await Leaderboard.findOneAndUpdate(
          { playerName: highscore.playerName },
          { $inc: { silverMedals: 1, medalScore: 2 } },
          { upsert: true }
        );
        break;
      case 2:
        await Leaderboard.findOneAndUpdate(
          { playerName: highscore.playerName },
          { $inc: { bronzeMedals: 1, medalScore: 1 } },
          { upsert: true }
        );
        break;
      default:
        break;
    }
  }

  // update the cache
  leaderboardCacheNeedsUpdate = true;

  res.status(200).json({ message: "leaderboard updated" });
});

module.exports = leaderboardRouter;
