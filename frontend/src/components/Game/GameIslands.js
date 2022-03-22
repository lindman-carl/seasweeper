import React, { useState, useEffect } from "react";
import axios from "axios";

import gameUtils from "./gameUtils";
import { generateValidMergedMap } from "./islandMapGenerator";

// components
import Tile from "./Tile";
import GameOverBox from "./GameOverBox";
import Hud from "./Hud";

// icons & animations
import { ClipLoader } from "react-spinners";

// data fetching functions
const postHighscore = async (time, playerName, gameMode) => {
  const res = await axios.post("/api/highscores", {
    time,
    playerName: playerName.trim(),
    gameMode,
  });

  return res.data;
};

const Game = ({
  gamemodeObject,
  gamemodeObject: {
    board,
    nLighthouses,
    w,
    h,
    name,
    nIslands,
    clusterSpread,
    nBombs,
    handleShowGamemodeCarousel,
  },
  refetchHighscore,
}) => {
  // states, should use useReducer
  const [currentBoard, setCurrentBoard] = useState(board);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [win, setWin] = useState(false);
  const [nRevealed, setNRevealed] = useState(0);
  const [isSendingHighscore, setIsSendingHighscore] = useState(false);
  const [seaTiles, setSeaTiles] = useState(
    board?.filter ? board.filter((t) => t.type !== 1).length : null
  );

  // lighthouseMode
  const [lighthouseMode, setLighthouseMode] = useState(false);
  const [availableLighthouses, setAvailableLighthouses] =
    useState(nLighthouses);

  // markMode
  const [markMode, setMarkMode] = useState(false);

  const refreshRate = 100;

  const generateIslandMap = async () => {
    // generate a map and make a game board out of it
    // creates the map async, to keep the app responsive
    const tempMap = await generateValidMergedMap(w, h, nIslands, clusterSpread);
    const tempBoard = await gameUtils.populateGeneratedMap(nBombs, tempMap);
    const nSeaTiles = tempBoard.filter((t) => t.type !== 1).length;
    console.log("nseatiles", nSeaTiles);
    // set states
    setCurrentBoard(tempBoard);
    setSeaTiles(nSeaTiles);
  };

  const generateOpenseaMap = () => {
    const blankMap = gameUtils.populateBoard(w, h, nBombs);
    const nSeaTiles = w * h;
    // states
    setCurrentBoard(blankMap);
    setSeaTiles(nSeaTiles);
  };

  const generateMap = () => {
    if (nIslands > 0) {
      generateIslandMap();
    } else {
      generateOpenseaMap();
    }
  };

  useEffect(() => {
    console.log("starting", gamemodeObject.name);
    console.log(board);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const countRevealed = (boardToCount) => {
    const revealed = boardToCount.filter(
      (t) => t.type !== 1 && t.revealed && !t.bomb
    ).length;
    return revealed;
  };

  const revealAll = () => {
    const revealedBoard = currentBoard.map((t) =>
      t.type === 2 ? { ...t, revealed: true } : t
    );
    return revealedBoard;
  };

  const restartGame = async () => {
    console.log("restartGame");

    setGameStarted(false);
    setGameOver(false);
    setGameTime(0);
    clearInterval(intervalId);

    setWin(false);
    setAvailableLighthouses(nLighthouses);
  };

  const startGame = () => {
    console.log("startGame");
    setNRevealed(0);
    setGameStarted(true);

    // timer
    clearInterval(intervalId);
    const tempTime = Date.now();
    const gameInterval = setInterval(() => {
      setGameTime(Date.now() - tempTime);
    }, refreshRate);
    setIntervalId(gameInterval);
  };

  const newGame = async () => {
    await generateMap();
    restartGame();
  };

  // functions extended to parent
  // useImperativeHandle(ref, () => ({
  //   async restart() {
  //     alert("restart");
  //     await restartGame();
  //   },
  // }));

  // event handlers
  const handleSendHighscore = async ({ playerName }) => {
    setIsSendingHighscore(true); // trigger loading animation

    const postedHighscore = await postHighscore(gameTime, playerName, name);
    console.log("posted highscore", postedHighscore);

    setIsSendingHighscore(false); // untrigger loading animation

    refetchHighscore(); // refetch highscore list
  };

  const checkWinConditions = (boardToCheck) => {
    const revealed = countRevealed(boardToCheck);
    setNRevealed(revealed);

    if (revealed >= seaTiles - nBombs) {
      console.log("win");
      setWin(true);
      setGameOver(true);
      clearInterval(intervalId);
    }
  };

  const handleClick = (tile) => {
    // dont handle clicks if the game is over
    if (gameOver) {
      clearInterval(intervalId);
      return null;
    }

    if (!lighthouseMode && tile.type === 1) {
      return null;
    }

    // markMode
    if (markMode) {
      // if water, toggle marked
      if (tile.type === 2) {
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
        setNRevealed(countRevealed(litMap)); // update number of revealed tile

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
        console.log("boom");
        // repopulate board
        newGame();
        startGame();
        return null;
      }

      startGame();
    }

    // if bomb is clicked setGameOver
    if (tile.bomb) {
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

  const handleLighthouseMode = () => {
    if (availableLighthouses > 0) {
      setLighthouseMode(!lighthouseMode);
      setMarkMode(false);
    }
  };

  const handleMarkMode = () => {
    setMarkMode(!markMode);
    setLighthouseMode(false);
  };

  if (currentBoard) {
    return (
      <div
        className="
              w-screen min-h-screen
              lg:w-full
              bg-sky-50
              flex flex-col justify-start items-center"
      >
        <Hud
          nBombs={nBombs}
          seaTiles={seaTiles}
          nRevealed={nRevealed}
          gameStarted={gameStarted}
          gameOver={gameOver}
          gameTime={gameTime}
          win={win}
          lighthouseMode={lighthouseMode}
          availableLighthouses={availableLighthouses}
          handleLighthouseMode={handleLighthouseMode}
          markMode={markMode}
          handleMarkMode={handleMarkMode}
        />
        {currentBoard && <div className="flex flex-col">{renderMap()}</div>}
        {gameOver && (
          <GameOverBox
            gameTime={gameTime}
            win={win}
            handleSendHighscore={handleSendHighscore}
            isSendingHighscore={isSendingHighscore}
            handleRestartGame={newGame}
          />
        )}
      </div>
    );
  } else {
    return (
      <div className="w-full min-h-[50vh] flex flex-column items-center justify-center">
        <div className="font-thin">Generating map...</div>
        <ClipLoader size={20} />
      </div>
    );
  }
};

export default Game;
