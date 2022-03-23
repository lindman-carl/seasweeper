import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
// 3d
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import boatModel from "./assets/models3d/speedboat.glb";

import gameUtils from "./components/Game/gameUtils";
import { generateValidMergedMap } from "./components/Game/islandMapGenerator";

// components
import GameIslands from "./components/Game/GameIslands";
import HighScoresContainer from "./components/Highscore/HighscoreContainer";
import HighscoreList from "./components/Highscore/HighscoreList";
import Logo from "./components/Logo";
import GamemodeCarousel from "./components/Game/GamemodeCarousel";
import IconCheckbox from "./components/Game/IconCheckbox";

// icons
import { GiCompass, GiTrophy } from "react-icons/gi";
import HighscoreFilter from "./components/Highscore/HighscoreFilter";

const fetchHighscores = async () => {
  const res = await axios.get("/api/highscores");
  const sortedData = res.data.sort((a, b) => a.time - b.time);
  return sortedData;
};

const generateBoard = async ({ w, h, nBombs, nIslands, clusterSpread }) => {
  let tempBoard;
  if (nIslands > 0) {
    const tempMap = await generateValidMergedMap(w, h, nIslands, clusterSpread);
    tempBoard = await gameUtils.populateGeneratedMap(nBombs, tempMap);
  } else {
    tempBoard = gameUtils.populateBoard(w, h, nBombs);
  }
  return tempBoard;
};

const mapGamemodes = async (gamemodes) => {
  const mappedGamemodes = await Promise.all(
    gamemodes.map(async (gm) => {
      const newBoard = await generateBoard(gm);
      const mapped = { ...gm, board: newBoard };
      return mapped;
    })
  );

  return mappedGamemodes;
};

const regenerateSingleMappedGamemode = async (mappedGamemodes, id) => {
  const oldMappedGamemode = mappedGamemodes.find((gm) => gm.id === id);
  const newBoard = await generateBoard(oldMappedGamemode);
  const newMappedGamemode = { ...oldMappedGamemode, board: newBoard };
  const newMappedGamemodes = [
    ...mappedGamemodes.filter((gm) => gm.id !== id),
    newMappedGamemode,
  ];

  return newMappedGamemodes;
};

const GameApp = ({ name, gamemodes }) => {
  // refs
  const gamemodeSelectRef = useRef();
  // hooks
  const navigate = useNavigate();

  // states¨
  const [mappedGamemodes, setMappedGamemodes] = useState(null);
  const [currentGamemodeId, setCurrentGamemodeId] = useState(0);
  const [currentGamemodeObject, setCurrentGamemodeObject] = useState(null);
  const [showGamemodeCarousel, setShowGamemodeCarousel] = useState(false);
  const [randomKey, setRandomKey] = useState(
    Math.floor(Math.random() * 100000)
  );
  const [currentMapFilter, setCurrentMapFilter] = useState(gamemodes[0].name);
  const [currentSearchFilter, setCurrentSearchFilter] = useState("");
  const [filteredHighscoreData, setFilteredHighscoreData] = useState(null);

  const {
    data: highscoreData,
    isLoading,
    error,
    refetch,
  } = useQuery("highscores", fetchHighscores, {
    refetchOnWindowFocus: false,
  });

  const handleRefetch = useCallback(() => {
    console.log("refetching highscores");
    refetch();
  }, [refetch]);

  const getGamemodeObject = (id) => {
    return mappedGamemodes.find((gm) => gm.id === id);
  };

  const handleSelectGamemode = async (id) => {
    console.log("navigate to", id);
    setCurrentGamemodeId(id);
    const current = getGamemodeObject(id);
    console.log("current", current);
    setCurrentGamemodeObject(current);
    setShowGamemodeCarousel(false);
    setRandomKey(Math.floor(Math.random() * 100000));
    // forceUpdate();
    const newMappedGamemodes = await regenerateSingleMappedGamemode(
      mappedGamemodes,
      id
    );
    setMappedGamemodes(newMappedGamemodes);
    console.log("done", current);
  };

  const handleCloseSelectGamemode = () => {
    setShowGamemodeCarousel(false);
  };

  const handleShowGamemodeCarousel = () => {
    setShowGamemodeCarousel(!showGamemodeCarousel);
  };

  useEffect(() => {
    const start = async () => {
      const mapped = await mapGamemodes(gamemodes);
      const current = mapped.find((gm) => gm.id === currentGamemodeId);

      setMappedGamemodes(mapped);
      setCurrentGamemodeObject(current);
    };
    start();
  }, []);

  const handleSearchFilter = ({ target }) => {
    setCurrentSearchFilter(target.value);
    const filtered = filterHighscores(target.value);
    setFilteredHighscoreData(filtered);
  };
  const handleMapFilter = ({ target }) => {
    setCurrentMapFilter(target.value);
    const filtered = filterHighscores();
    setFilteredHighscoreData(filtered);
  };
  const filterHighscores = (searchString) => {
    const filteredByGamemode = highscoreData.filter(
      (el) => el.gameMode === currentMapFilter
    );

    if (searchString) {
      return filteredByGamemode.filter((el) =>
        el.name
          .toLowerCase()
          .trim()
          .includes(searchString.toLowerCase().trim())
          .sort((a, b) => a.time - b.time)
      );
    }

    return filteredByGamemode.sort((a, b) => a.time - b.time);
  };

  return (
    <>
      {currentGamemodeObject && (
        <div
          className="
        h-full 
        flex flex-col items-start justify-center 
        lg:h-screen lg:min-h-full
        lg:flex-row lg:justify-center
        lg:overflow-hidden
        overflow-x-hidden"
        >
          <GameIslands
            gamemodeObject={currentGamemodeObject}
            refetchHighscore={handleRefetch}
            gamemodes={gamemodes}
            key={randomKey}
            showGamemodeCarousel={showGamemodeCarousel}
            handleShowGamemodeCarousel={handleShowGamemodeCarousel}
          >
            {showGamemodeCarousel && (
              <GamemodeCarousel
                name={name}
                mappedGamemodes={mappedGamemodes}
                gamemodes={gamemodes}
                handleSelectGamemode={handleSelectGamemode}
                handleCloseSelectGamemode={handleCloseSelectGamemode}
                showGamemodeCarousel={showGamemodeCarousel}
              />
            )}
          </GameIslands>
          <div
            className="flex flex-col items-center justify-center
            mt-4 lg:ml-16"
            id="canvas-div"
          >
            {/* <canvas className="webgl"></canvas> */}
            <div className="flex flex-col items-center justify-center w-screen lg:w-full lg:h-screen lg:overflow-y-scroll">
              <Logo />
              <div className="lg:ml-4">
                <div className="max-w-fit mt-2 mb-6 text-base md:text-lg text-sky-900 font-light text-center">
                  Click to reveal tile. Place lighthouses on shoreline to reveal
                  water tiles. Flags are for slow players, try to mark the mines
                  in your head!
                  <br />
                </div>
                <HighScoresContainer>
                  <div className="relative -top-4">
                    <IconCheckbox
                      icon={<GiTrophy size={28} />}
                      status={false}
                      onClick={() => navigate("/highscores")}
                      tooltip={"Browse highscores"}
                      primaryColor={"#D6AF36"}
                    />
                  </div>
                  <div className="flex flex-row items-center mb-4">
                    <HighscoreFilter onChange={handleSearchFilter} />
                    <select
                      className="highscores-select "
                      onChange={handleMapFilter}
                    >
                      {gamemodes.map((gm) => (
                        <option label={gm.label} value={gm.name} key={gm.id} />
                      ))}
                    </select>
                  </div>
                  <HighscoreList
                    data={
                      filteredHighscoreData
                        ? filteredHighscoreData
                        : highscoreData
                    }
                    isLoading={isLoading}
                    error={error}
                    filter={currentGamemodeObject.name}
                    inGame={false}
                  />
                </HighScoresContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameApp;
