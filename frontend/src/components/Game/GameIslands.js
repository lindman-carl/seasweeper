import React, { useState, useEffect } from "react";
import axios from "axios";

import gameUtils from "./gameUtils";
import { generateValidMergedMap } from "./islandMapGenerator";

// components
import Timer from "./Timer";
import Tile from "./Tile";
import GameOverBox from "./GameOverBox";
import { ClipLoader } from "react-spinners";

// data fetching functions
const postHighscore = async (time, playerName) => {
  const res = await axios.post("http://localhost:3001/api/highscores", {
    time,
    playerName: playerName.trim(),
    gameMode: "island10",
  });

  return res.data;
};

function Game({ w, h, nIslands, clusterSpread, nBombs }) {
  // states, should use useReducer
  const [generatedMap, setGeneratedMap] = useState(null);
  const [board, setBoard] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [win, setWin] = useState(false);
  const [nRevealed, setNRevealed] = useState(0);
  const [isSendingHighscore, setIsSendingHighscore] = useState(false);
  const [seaTiles, setSeaTiles] = useState(null);

  const refreshRate = 10;

  useEffect(() => {
    const generate = async () => {
      console.log("generate");
      const tempMap = await generateValidMergedMap(
        w,
        h,
        nIslands,
        clusterSpread
      );
      console.log("temp:", tempMap);
      setGeneratedMap(tempMap);
      console.log("state", generatedMap);
      const tempBoard = gameUtils.populateGeneratedMap(nBombs, tempMap);
      setBoard(tempBoard);
      setSeaTiles(tempBoard.filter((t) => t.type === 2).length);
    };
    generate();
  }, []);

  const countRevealed = (boardToCount) => {
    const revealed = boardToCount.filter((t) => t.revealed).length;
    return revealed;
  };

  const revealAll = () => {
    const revealedBoard = board.map((t) =>
      t.type === 2 ? { ...t, revealed: true } : t
    );
    return revealedBoard;
  };

  const flagAllBombs = (currentBoard) => {
    const flaggedBoard = currentBoard.map((t) =>
      t.bomb ? { ...t, flag: true } : t
    );
    return flaggedBoard;
  };

  const restartGame = () => {
    console.log("restarting");
    setGeneratedMap(generateValidMergedMap(w, h, nIslands, clusterSpread));
    setBoard(gameUtils.populateGeneratedMap(nBombs, generatedMap));
    setGameStarted(false);
    setGameOver(false);
    setGameTime(0);
    setNRevealed(0);
    clearInterval(intervalId);
    setWin(false);
  };

  const startGame = () => {
    setGameStarted(true);
    const gameInterval = setInterval(() => {
      setGameTime((prev) => prev + refreshRate);
    }, refreshRate);
    setIntervalId(gameInterval);
  };

  // event handlers
  const handlePlayerNameChange = ({ target }) => {
    // setPlayerName(target.value);
  };

  const handleSendHighscore = async ({ playerName }) => {
    setIsSendingHighscore(true); // trigger loading animation

    const postedHighscore = await postHighscore(gameTime, playerName);
    console.log("posted highscore", postedHighscore);

    setIsSendingHighscore(false); // untrigger loading animation
  };

  const handleClick = (tile) => {
    // dont handle clicks if the game is over
    if (gameOver) {
      return null;
    }

    // cant click land
    if (tile.type === 1) {
      return null;
    }

    // start game if not already started
    if (!gameStarted) {
      // never start on bomb
      if (tile.bomb) {
        console.log("boom");
        // repopulate board
        restartGame();
        return;
      }
      console.log("starting game");
      startGame();
    }

    // if bomb is clicked setGameOver
    if (tile.bomb) {
      setGameOver(true);
      // reveal all
      setBoard(revealAll());
      clearInterval(intervalId);
      return null;
    }

    const copiedBoard = [...board];
    let tilesToReveal = [];

    tilesToReveal.push(tile.id);

    if (tile.count === 0) {
      tilesToReveal = gameUtils.startFloodFill(tile, board, tilesToReveal);
    }

    const updatedBoard = copiedBoard.map((t) =>
      tilesToReveal.includes(t.id) ? { ...t, revealed: true } : t
    );

    const sortedUpdatedBoard = updatedBoard.sort((a, b) => a.id - b.id);
    const revealed = countRevealed(sortedUpdatedBoard);

    if (revealed === seaTiles - nBombs) {
      console.log("win");
      setWin(true);
      setGameOver(true);
      setBoard(flagAllBombs(sortedUpdatedBoard));
      clearInterval(intervalId);
    }

    setBoard(sortedUpdatedBoard);
    setNRevealed(revealed);
  };

  if (board) {
    return (
      <div
        className="
              w-screen h-max 
              sm:h-full 
              lg:w-full
              flex flex-col justify-start items-center"
      >
        <div className="mt-2 mb-2 text-2xl text-slate-700 font-bold">
          <Timer time={gameTime} />
        </div>
        <div className=" text-2xl text-slate-700 font-bold">
          {!gameOver
            ? `Tiles left to clear: ${seaTiles - nRevealed - nBombs}`
            : win
            ? "You win!"
            : "Game over!"}
        </div>
        <div
          className={`grid gap-0 grid-flow-row grid-cols-${w} auto-rows-max`}
          // style={{
          //   display: "grid",
          //   gridGap: 0,
          //   gridAutoFlow: "row",
          //   gridTemplateColumns: w,
          //   gridTemplateRows: h,
          // }}
        >
          {board &&
            board.map((tile, idx) => (
              <Tile
                key={idx}
                tile={tile}
                onClick={() => handleClick(tile)}
                board={board}
              />
            ))}
        </div>
        {gameOver && (
          <GameOverBox
            gameTime={gameTime}
            win={win}
            handlePlayerNameChange={handlePlayerNameChange}
            handleSendHighscore={handleSendHighscore}
            isSendingHighscore={isSendingHighscore}
            handleRestartGame={restartGame}
          />
        )}
        <div className="mt-2 text-base md:text-lg text-slate-700 font-thin text-center">
          Click to reveal tile. Flags are for slow players, mark the mines in
          your head!
        </div>
      </div>
    );
  } else {
    return <ClipLoader />;
  }
}

export default Game;
