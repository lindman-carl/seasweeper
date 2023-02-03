import axios from "axios";
import bcrypt from "bcryptjs";

// types
import { HighscoreEntry } from "../types";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001/api/"
    : "https://seasweeper.lindman.dev/api/";

const HIGHSCORES_API_URL = BASE_URL + "highscores";
const DAILY_API_URL = BASE_URL + "daily";

const fetchHighscores = async () => {
  // const res = await axios.get("/api/highscores");
  const res = await axios.get<HighscoreEntry[]>(HIGHSCORES_API_URL);
  const sortedData = res.data.sort((a, b) => a.time - b.time);
  return sortedData;
};

const postHighscore = async (
  time: number,
  playerName: string,
  gameMode: string
) => {
  const trimmedPlayerName = playerName.trim();
  localStorage.setItem("playerName", trimmedPlayerName);

  // create hashsum of time, gameMode and playerName
  const hashString = `${time}${gameMode}${trimmedPlayerName}${process.env.REACT_APP_SECRET_KEY}`;
  const hash = await bcrypt.hash(hashString, 10);

  const res = await axios.post(HIGHSCORES_API_URL, {
    time,
    playerName: trimmedPlayerName,
    gameMode,
    hash,
  });
  return res.data;
};

// GET the daily map
const fetchDaily = async () => {
  if (!process.env.REACT_APP_DAILY_KEY) {
    console.error("no env var REACT_APP_DAILY_KEY");
    return;
  }

  const dailyMap = await axios.get(DAILY_API_URL, {
    headers: {
      key: process.env.REACT_APP_DAILY_KEY,
    },
  });

  console.log(dailyMap.data);

  return dailyMap.data;
};

export { fetchHighscores, postHighscore, fetchDaily };
