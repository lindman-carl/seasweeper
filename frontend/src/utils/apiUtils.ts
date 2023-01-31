import axios from "axios";

// types
import { HighscoreEntry } from "../types";

const HIGHSCORES_API_URL = "https://seasweeper.lindman.dev/api/highscores";

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
  localStorage.setItem("playerName", playerName.trim());
  const res = await axios.post(HIGHSCORES_API_URL, {
    time,
    playerName: playerName.trim(),
    gameMode,
  });
  return res.data;
};

export { fetchHighscores, postHighscore };
