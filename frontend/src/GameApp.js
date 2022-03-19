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

const GameApp = ({ w, h, nIslands, clusterSpread, nBombs }) => {
  const {
    data: highscoreData,
    isLoading,
    error,
  } = useQuery("highscores", fetchHighscores, {
    refetchOnWindowFocus: false,
  });

  return (
    <div
      className="
          flex flex-col items-center justify-center 
          lg:flex-row lg:justify-center"
    >
      <div className="">
        <Game
          w={w}
          h={h}
          nIslands={nIslands}
          clusterSpread={clusterSpread}
          nBombs={nBombs}
        />
      </div>
      <div className="justify-self-start lg:ml-4">
        <HighscoreList
          data={highscoreData}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default GameApp;
