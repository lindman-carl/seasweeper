import axios from "axios";

const fetchHighscores = async () => {
  const res = await axios.get("/api/highscores");
  // const res = await axios.get(
  //   "https://seasweeper.herokuapp.com/api/highscores"
  // );
  const sortedData = res.data.sort((a, b) => a.time - b.time);
  return sortedData;
};

const postHighscore = async (time, playerName, gameMode) => {
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
