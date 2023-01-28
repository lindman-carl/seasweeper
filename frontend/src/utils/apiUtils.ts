import axios from "axios";

// types
import { HighscoreEntry } from "../types";

const fetchHighscores = async () => {
  // const res = await axios.get("/api/highscores");
  const res = await axios.get<HighscoreEntry[]>(
    // "https://seasweeper.herokuapp.com/api/highscores"
    "https://prickly-moth-slippers.cyclic.app/api/highscores"
  );
  const sortedData = res.data.sort((a, b) => a.time - b.time);
  return sortedData;
};

const postHighscore = async (
  time: number,
  playerName: string,
  gameMode: string
) => {
  localStorage.setItem("playerName", playerName.trim());
  const res = await axios.post("/api/highscores", {
    // const res = await axios.post(
    //   "https://seasweaper.herokuapp.com/api/highscores",
    //   {
    time,
    playerName: playerName.trim(),
    gameMode,
  });
  return res.data;
};

export { fetchHighscores, postHighscore };
