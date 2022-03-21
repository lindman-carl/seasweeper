import axios from "axios";
import { useQuery } from "react-query";

// components
import GameIslands from "./components/Game/GameIslands";
import HighscoreList from "./components/Highscore/HighscoreList";
import Logo from "./components/Logo";

const fetchHighscores = async () => {
  const res = await axios.get("/api/highscores");
  const sortedData = res.data.sort((a, b) => a.time - b.time);
  return sortedData;
};

const GameApp = ({ name, gamemodes, navigate }) => {
  const {
    data: highscoreData,
    isLoading,
    error,
    refetch,
  } = useQuery("highscores", fetchHighscores, {
    refetchOnWindowFocus: false,
  });

  const handleRefetch = () => {
    console.log("refetching highscores");
    refetch();
  };

  const { w, h, nBombs, nIslands, clusterSpread, nLighthouses } =
    gamemodes.find((gamemode) => gamemode.name === name);

  return (
    <div
      className="
          flex flex-col items-center justify-center 
          lg:flex-row lg:justify-center"
    >
      <div className="">
        <GameIslands
          w={w}
          h={h}
          nBombs={nBombs}
          nLighthouses={nLighthouses}
          nIslands={nIslands}
          clusterSpread={clusterSpread}
          refetchHighscore={handleRefetch}
          name={name}
          gamemodes={gamemodes}
          navigate={navigate}
        />
      </div>
      <div className="flex flex-col items-center">
        <Logo />
        <div className="justify-self-start lg:ml-4">
          <HighscoreList
            data={highscoreData}
            isLoading={isLoading}
            error={error}
            filter={name}
            inGame={false}
          />
        </div>
      </div>
    </div>
  );
};

export default GameApp;
