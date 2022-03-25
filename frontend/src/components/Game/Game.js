import { useEffect, useState } from "react";
import { useQuery } from "react-query";
// 3d
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import boatModel from "./assets/models3d/speedboat.glb";

import gameUtils from "./gameUtils";
import { fetchHighscores, postHighscore } from "./apiUtils";
import { generateValidMergedMap } from "./islandMapGenerator";

// components
import HighScoresContainer from "../Highscore/HighscoreContainer";
import HighscoreList from "../Highscore/HighscoreList";
import Logo from "../Logo";
import GamemodeCarousel from "./GamemodeCarousel";
import IconCheckbox from "./IconCheckbox";
import Hud from "./Hud";
import Tile from "./Tile";
import GameOverBox from "./GameOverBox";
import ScrollDownArrow from "./ScrollDownArrow";
import TutorialCarousel from "./TutorialCarousel";

// icons
import { GiTrophy } from "react-icons/gi";
import HighscoreFilter from "../Highscore/HighscoreFilter";

// spinner
import { ClipLoader } from "react-spinners";

const GeneratingMapSpinner = () => {
  return (
    <div className="w-full min-h-[50vh] flex flex-column items-center justify-center">
      <div className="font-thin">Generating map...</div>
      <ClipLoader size={20} />
    </div>
  );
};

const generateBoard = async ({ w, h, numBombs, nIslands, clusterSpread }) => {
  let tempBoard;
  if (nIslands > 0) {
    const tempMap = await generateValidMergedMap(w, h, nIslands, clusterSpread);
    tempBoard = await gameUtils.populateGeneratedMap(numBombs, tempMap);
  } else {
    tempBoard = gameUtils.populateBoard(w, h, numBombs);
  }
  return tempBoard;
};

const mapGamemodes = async (gamemodes) => {
  const mappedGamemodes = await Promise.all(
    gamemodes
      .map(async (gm) => {
        const newBoard = await generateBoard(gm);
        const mapped = { ...gm, board: newBoard };
        return mapped;
      })
      .sort((a, b) => a.id - b.id)
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

  return newMappedGamemodes.sort((a, b) => a.id - b.id);
};

const GameBoard = ({
  gamemodeObject,
  gamemodeObject: {
    board,
    nLighthouses,
    w,
    h,
    name,
    nIslands,
    clusterSpread,
    numBombs,
    showGamemodeCarousel,
  },
  handleToggleGamemodeCarousel,
  handleRefetchHighscore,
  children,
}) => {
  // map state
  const [currentBoard, setCurrentBoard] = useState(board);
  const [numRevealed, setNumRevealed] = useState(0);
  const [numMarkers, setNumMarkers] = useState(0);
  const [numWaterTiles, setNumWaterTiles] = useState(
    board?.filter ? board.filter((t) => t.type !== 1).length : null
  ); // calculates number of water tiles

  // game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [gameTime, setGameTime] = useState(0);

  const [lighthouseMode, setLighthouseMode] = useState(false);
  const [markMode, setMarkMode] = useState(false);
  const [availableLighthouses, setAvailableLighthouses] =
    useState(nLighthouses);

  // etc, states
  const [intervalId, setIntervalId] = useState();
  const [isSendingHighscore, setIsSendingHighscore] = useState(false);

  const refreshRate = 100; // sets timer accuracy

  // generate a new map, for restarting
  const generateMap = () => {
    // call correct map generation
    if (nIslands > 0) {
      generateNewIslandMap();
    } else {
      generateOpenseaMap();
    }
  };

  const generateNewIslandMap = async () => {
    // generate a map and make a game board out of it
    // creates the map async, to keep the app responsive
    const tempMap = await generateValidMergedMap(w, h, nIslands, clusterSpread);
    const tempBoard = await gameUtils.populateGeneratedMap(numBombs, tempMap);
    const countWaterTiles = tempBoard.filter((t) => t.type !== 1).length;
    console.log("countWaterTiles", countWaterTiles);
    // set states

    setCurrentBoard(tempBoard);
    setNumWaterTiles(countWaterTiles);
  };

  const generateOpenseaMap = () => {
    const blankMap = gameUtils.populateBoard(w, h, numBombs);
    const countWaterTiles = w * h;
    // states
    setCurrentBoard(blankMap);
    setNumWaterTiles(countWaterTiles);
  };

  const depopulateBoard = (boardToDepopulate) => {
    const depopulated = boardToDepopulate.map((tile) => ({
      ...tile,
      bomb: false,
      marked: false,
      lighthouse: false,
      lit: false,
      count: -1,
    }));
    return depopulated;
  };

  const repopulateMap = async () => {
    // dont generate islands on open sea
    if (nIslands < 0) {
      generateOpenseaMap();
      return;
    }
    const depopulatedBoard = depopulateBoard(currentBoard);
    console.log("depop", depopulatedBoard);
    const repopulatedBoard = gameUtils.populateBombs({
      board: depopulatedBoard,
      w,
      h,
      nBombs: numBombs,
    });
    const countWaterTiles = repopulatedBoard.filter((t) => t.type !== 1).length;
    const unrevealedBoard = unrevealAll(repopulatedBoard);
    // states
    setCurrentBoard(unrevealedBoard);
    setNumWaterTiles(countWaterTiles);
  };

  useEffect(() => {
    // logging
    console.log("starting", gamemodeObject.name);
    console.log(board);

    // clear interval on unmount
    return () => {
      clearInterval(intervalId);
    };

    // why if I only want on mount???
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // restart game
  const restartGame = async () => {
    console.log("restartGame");

    // resets game states
    setGameStarted(false);
    setGameOver(false);
    setWin(false);
    setGameTime(0);
    setNumMarkers(0);
    setAvailableLighthouses(nLighthouses);

    // clear timer
    clearInterval(intervalId);
  };

  // start game
  const startGame = () => {
    console.log("startGame");
    setNumRevealed(0);
    setGameStarted(true);

    // set timer
    clearInterval(intervalId); // clear timer first

    // get timestamp for calculating game time
    const tempTime = Date.now();

    // set game timer interval
    const gameInterval = setInterval(() => {
      setGameTime(Date.now() - tempTime);
    }, refreshRate);

    // store intervalId
    setIntervalId(gameInterval);
  };

  // generate new map and restart game
  const newGame = async () => {
    await generateMap();
    restartGame();
  };

  const retryGame = async () => {
    await repopulateMap();
    restartGame();
  };

  // counts number of revealed
  const countRevealed = (boardToCount) => {
    // filter for non-land tiles that are revealed and not a bomb
    const revealed = boardToCount.filter(
      (t) => t.type !== 1 && t.revealed && !t.bomb
    ).length;

    return revealed;
  };

  // reveals all water tiles on board
  const revealAll = () => {
    // map { revealed: true } to all water tiles
    const revealedBoard = currentBoard.map((t) =>
      t.type === 2 ? { ...t, revealed: true } : t
    );
    return revealedBoard;
  };

  // reveals all water tiles on board
  const unrevealAll = (boardToUnreveal) => {
    const unrevealedBoard = boardToUnreveal.map((t) =>
      t.type === 2 ? { ...t, revealed: false } : t
    );
    return unrevealedBoard;
  };

  // check for win conditions on current board
  const checkWinConditions = (boardToCheck) => {
    const revealed = countRevealed(boardToCheck);
    setNumRevealed(revealed);

    // win
    if (revealed >= numWaterTiles - numBombs) {
      console.log("win");
      setWin(true);
      setGameOver(true);
      clearInterval(intervalId);
    }
  };

  // event handlers
  const handleSendHighscore = async ({ playerName }) => {
    setIsSendingHighscore(true); // trigger loading animation

    const postedHighscore = await postHighscore(gameTime, playerName, name);
    console.log("posted highscore", postedHighscore);

    setIsSendingHighscore(false); // untrigger loading animation

    handleRefetchHighscore(); // refetch highscore list
  };

  // eventhandler for clicking lighthouse mode button
  const handleLighthouseMode = () => {
    // available lighthouses
    if (availableLighthouses > 0) {
      setLighthouseMode(!lighthouseMode);
      // disable mark mode
      setMarkMode(false);
    }
  };

  // eventhandler for clicking mark mode button
  const handleMarkMode = () => {
    setMarkMode(!markMode);
    // disable lighthouse mode
    setLighthouseMode(false);
  };

  /**
   * Click tile eventhandler
   * @param {Tile} Tile clicked on
   */
  const handleClick = (tile) => {
    // dont handle clicks if the game is over
    if (gameOver) {
      clearInterval(intervalId);
      return null;
    }

    if (showGamemodeCarousel) {
      return null;
    }

    if (!lighthouseMode && tile.type === 1) {
      return null;
    }

    // markMode
    if (markMode) {
      // if water, toggle marked
      if (tile.type === 2) {
        if (!tile.revealed) {
          if (!tile.marked) {
            setNumMarkers((prev) => prev + 1);
          } else {
            setNumMarkers((prev) => prev - 1);
          }
        }
        tile.marked = !tile.marked;
      }
      // do nothing if land
      return null;
    } else if (tile.marked) {
      return null;
    }

    // lighthouse mode
    if (lighthouseMode) {
      // check if on land
      if (tile.type === 1 && availableLighthouses > 0) {
        console.log("placing lighthouse");
        // set lighthouse
        // filters and map ids of the tiles directly surrounding the lighthouse,
        // max 8 ignore self
        const litTiles = currentBoard
          .filter(
            (t) =>
              t.x >= tile.x - 1 &&
              t.x <= tile.x + 1 &&
              t.y >= tile.y - 1 &&
              t.y <= tile.y + 1 &&
              t.id !== tile.id &&
              t
          )
          .map((t) => t.id);

        console.log("lit tiles", litTiles);

        // maps lighthouse to tile
        const newMap = currentBoard.map((t) =>
          t.id === tile.id ? { ...t, lighthouse: true } : t
        );
        // maps lit tiles
        const litMap = newMap.map((t) =>
          litTiles.includes(t.id) ? { ...t, revealed: true, lit: true } : t
        );

        console.log("lit map", litMap);

        // decrement available lighthouses
        setAvailableLighthouses((prev) => prev - 1);

        // toggles lighthouse mode if no more lighthouses are available
        if (availableLighthouses < 1) {
          setLighthouseMode(false);
        }

        // check if the placed lighthouse has won the game
        checkWinConditions(litMap);

        // update board
        setCurrentBoard(litMap);
        setNumRevealed(countRevealed(litMap)); // update number of revealed tile

        return null;
      } else {
        // toggle lighthouseMode
        setLighthouseMode(false);
      }
    } else if (tile.type === 1) {
      return null;
    }

    // start game if not already started
    if (!gameStarted) {
      // never start on bomb
      if (tile.bomb) {
        // repopulate board
        retryGame();

        tile.revealed = true;
        return null;
      }

      startGame();
    }

    // if bomb is clicked setGameOver
    if (tile.bomb && gameStarted) {
      setGameOver(true);
      // reveal all
      setCurrentBoard(revealAll());
      clearInterval(intervalId);
      return null;
    }

    // handle reveal and floodfill
    const copiedBoard = [...currentBoard];
    // use array to reveal all tiles at the same time
    let tilesToReveal = [];

    // reveal this tile
    tilesToReveal.push(tile.id);

    if (tile.count === 0) {
      // start flood fill algo if the tile has no neighbouring bombs
      tilesToReveal = gameUtils.startFloodFill(
        tile,
        currentBoard,
        tilesToReveal
      );
    }

    // reveal tiles and update board
    const updatedBoard = copiedBoard.map((t) =>
      tilesToReveal.includes(t.id) ? { ...t, revealed: true } : t
    );

    // sort board by id
    const sortedUpdatedBoard = updatedBoard.sort((a, b) => a.id - b.id);

    // check win
    checkWinConditions(sortedUpdatedBoard);

    // update board
    setCurrentBoard(sortedUpdatedBoard);

    // rerender map after click
    // renderMap();
  };

  /**
   *
   * @returns map rendered as flex box
   */
  const renderMap = () => {
    const rows = [];
    for (let y = 0; y < h; y++) {
      // iterate y axis
      const row = currentBoard
        .filter((t) => t.y === y)
        .sort((a, b) => a.x - b.x);
      const mappedRow = row.map((tile, idx) => (
        <Tile
          key={idx}
          tile={tile}
          onClick={() => handleClick(tile)}
          board={currentBoard}
          markMode={markMode}
        />
      ));
      rows.push(mappedRow);
    }

    const rowsMapped = rows.map((row, idx) => (
      <div key={idx} className="flex flex-row justify-start items-start shrink">
        {row}
      </div>
    ));
    return rowsMapped;
  };

  // props
  const hudProps = {
    numBombs,
    numMarkers,
    numWaterTiles,
    numRevealed,
    gameStarted,
    gameOver,
    gameTime,
    win,
    lighthouseMode,
    availableLighthouses,
    handleLighthouseMode,
    markMode,
    handleMarkMode,
    showGamemodeCarousel,
    handleToggleGamemodeCarousel,
  };

  const gameOverBoxProps = {
    gameTime,
    win,
    handleSendHighscore,
    isSendingHighscore,
    handleNewGame: newGame,
    handleRetry: retryGame,
    newAvailable: nIslands > 0,
  };

  // render
  if (currentBoard) {
    // render game if finished generating maps
    return (
      <div className="game-board-container">
        {children}
        <Hud {...hudProps} />
        {currentBoard && <div className="flex flex-col ">{renderMap()}</div>}
        {gameOver && <GameOverBox {...gameOverBoxProps} />}
        <ScrollDownArrow />
      </div>
    );
  }

  // render loading spinner while generating maps
  return <GeneratingMapSpinner />;
};

const GameApp = ({ name, gamemodes }) => {
  // states
  const [mappedGamemodes, setMappedGamemodes] = useState(null);
  const [currentGamemodeId, setCurrentGamemodeId] = useState(0);
  const [currentGamemodeObject, setCurrentGamemodeObject] = useState(null);
  const [showGamemodeCarousel, setShowGamemodeCarousel] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  // still necessary
  const [randomKey, setRandomKey] = useState(
    Math.floor(Math.random() * 100000)
  );

  // highscore filtering states
  const [currentMapFilter, setCurrentMapFilter] = useState(gamemodes[0].name);
  const [currentSearchFilter, setCurrentSearchFilter] = useState("");

  // fetch highscores on mount
  const {
    data: highscoreData,
    isLoading,
    error,
    refetch: handleRefetchHighscore,
  } = useQuery("highscores", fetchHighscores, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // generates initial maps for gamemodes
    const start = async () => {
      // generates maps for gamemodes
      const mapped = await mapGamemodes(gamemodes);
      // get ref to current gamemode
      const current = mapped.find((gm) => gm.id === currentGamemodeId);

      // states
      setMappedGamemodes(mapped);
      setCurrentGamemodeObject(current);
    };

    start();

    // why if I only want on mount???
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get gamemode objet by id
  const getGamemodeObject = (id) => {
    return mappedGamemodes.find((gm) => gm.id === id);
  };

  /**
   * Eventhandler for selecting gamemode by id
   * Also creates a new map for gamemode selection
   * @param {Number} id
   */
  const handleSelectGamemode = async (id) => {
    const current = getGamemodeObject(id);
    // generate a new map for the selected gamemode
    const newMappedGamemodes = await regenerateSingleMappedGamemode(
      mappedGamemodes,
      id
    );
    // update states
    setCurrentGamemodeId(id);
    setCurrentGamemodeObject(current);
    setMappedGamemodes(newMappedGamemodes);
    // update highscore filtering to match the selected gamemode
    setCurrentMapFilter(current.name);
    // closes carousel
    setShowGamemodeCarousel(false);
    setRandomKey(Math.floor(Math.random() * 100000)); // forces update, why i dont know, but it is needed
  };

  // toggles gamemode carousel show state
  const handleToggleGamemodeCarousel = () => {
    setShowGamemodeCarousel(!showGamemodeCarousel);
  };

  // handles and updates search names filter
  const handleSearchFilter = ({ target }) => {
    setCurrentSearchFilter(target.value.trim());
  };

  // handles map filter by selection of select input
  const handleMapFilter = ({ target }) => {
    setCurrentMapFilter(target.value);
  };

  // props
  const gameBoardProps = {
    gamemodeObject: currentGamemodeObject,
    handleRefetchHighscore,
    gamemodes,
    key: randomKey,
    showGamemodeCarousel,
    handleToggleGamemodeCarousel,
  };

  const gamemodeCarouselProps = {
    name,
    mappedGamemodes,
    gamemodes,
    handleSelectGamemode,
    handleToggleGamemodeCarousel,
    showGamemodeCarousel,
  };

  // render
  return (
    currentGamemodeObject && (
      <div className="game-app-container">
        <GameBoard {...gameBoardProps}>
          {showGamemodeCarousel && (
            <GamemodeCarousel {...gamemodeCarouselProps} />
          )}
          {showTutorial && <TutorialCarousel {...gamemodeCarouselProps} />}
        </GameBoard>
        <div className="game-info-container">
          <div className="flex flex-col items-center justify-start lg:mt-24 w-screen lg:w-full lg:h-full lg:overflow-y-scroll max-w-[436px]">
            <Logo />
            <div className="lg:ml-4">
              <div className="game-text-container">
                Click to reveal tile. Flags are for slow players, try to mark
                the mines in your head. Place lighthouses on shoreline to safely
                reveal adjacent water tiles.
                <a
                  href="https://minesweepergame.com/strategy.php"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-900 font-semibold mx-2 underline decoration-2 underline-offset-auto decoration-blue-300"
                  data-tip={"Show tutorial"}
                  data-for="checkboxInfo"
                >
                  Learn more
                </a>
              </div>
              <HighScoresContainer>
                <div className="relative -top-4">
                  <IconCheckbox
                    icon={<GiTrophy size={28} />}
                    status={false}
                    onClick={handleRefetchHighscore}
                    tooltip={"Refresh highscores"}
                    iconColor={"#D6AF36"}
                  />
                </div>
                <div className="flex flex-row items-center mb-4 ">
                  <HighscoreFilter onChange={handleSearchFilter} />
                  <select
                    className="highscores-select"
                    onChange={handleMapFilter}
                    value={currentMapFilter}
                  >
                    {gamemodes
                      .sort((a, b) => a.name > b.name)
                      .map((gm) => (
                        <option value={gm.name} key={gm.id}>
                          {gm.label}
                        </option>
                      ))}
                  </select>
                </div>
                <HighscoreList
                  data={highscoreData}
                  isLoading={isLoading}
                  error={error}
                  mapFilter={currentMapFilter}
                  searchFilter={currentSearchFilter}
                  inGame={false}
                />
              </HighScoresContainer>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default GameApp;
