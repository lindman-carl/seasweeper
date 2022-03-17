import axios from "axios";
import { useQuery } from "react-query";

import Game from "./components/Game";
import HighscoreList from "./components/Highscore/HighscoreList";

const fetchHighscores = async () => {
  const res = await axios.get("http://localhost:3001/api/highscores");
  const sortedData = res.data.sort((a, b) => a.time - b.time);
  console.log(sortedData);

  // get top 10
  const topTenData = sortedData.slice(0, 10);
  return topTenData;
};

const GameApp = () => {
  const {
    data: highscoreData,
    isLoading,
    error,
  } = useQuery("highscores", fetchHighscores, {
    refetchOnWindowFocus: false,
  });

  if (error) {
    console.log(error);
    return <div>error</div>;
  }

  return (
    <div>
      <Game />
      <HighscoreList data={highscoreData} isLoading={isLoading} />
    </div>
  );
};

export default GameApp;
