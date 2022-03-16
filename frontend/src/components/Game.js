import React, { useState } from "react";

import { BsCheckCircle } from "react-icons/bs";

import { Link } from "react-router-dom";

import axios from "axios";

import gameUtils from "./gameUtils";

// components
import Timer from "./Timer";
import Tile from "./Tile";

const postHighscore = async (time, playerName) => {
  const res = await axios.post("http://localhost:3001/api/highscores", {
    time,
    playerName,
  });
  console.log(res.data);
  return res.data;
};

function Game() {
  const [board, setBoard] = useState(gameUtils.populateBoard(10, 10, 10));
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [intervalId, setIntervalId] = useState();
  const [winTime, setWinTime] = useState(null);
  const [nRevealed, setNRevealed] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [canSendHighscore, setCanSendHighscore] = useState(false);
  const [hoveredTile, setHoveredTile] = useState(-1);

  const placeFlag = () => {
    console.log("placing at", hoveredTile);
    const flaggedTile = board.find((t) => t.id === hoveredTile);
    const newBoard = [
      ...board.filter((t) => t.id !== hoveredTile),
      { ...flaggedTile, flag: true },
    ];

    setBoard(newBoard);
  };

  const handleHover = (tile) => {
    setHoveredTile(tile.id);
  };

  const handleSendHighscore = () => {
    postHighscore(winTime, playerName);
    setCanSendHighscore(false);
  };

  const countRevealed = (boardToCount) => {
    const revealed = boardToCount.filter((t) => t.revealed).length;
    return revealed;
  };

  const revealAll = () => {
    const revealedBoard = board.map((t) => ({ ...t, revealed: true }));
    return revealedBoard;
  };

  const flagAllBombs = (currentBoard) => {
    const flaggedBoard = currentBoard.map((t) =>
      t.bomb ? { ...t, flag: true } : t
    );
    return flaggedBoard;
  };

  const restartGame = () => {
    setBoard(gameUtils.populateBoard(10, 10, 10));
    setGameStarted(false);
    setGameOver(false);
    setGameTime(0);
    setWinTime(null);
    setNRevealed(0);
    clearInterval(intervalId);
    setCanSendHighscore(false);
  };

  const startGame = () => {
    setGameStarted(true);
    const gameInterval = setInterval(() => {
      setGameTime((prev) => prev + 10);
    }, 10);
    setIntervalId(gameInterval);
  };

  const handleClick = (tile) => {
    // dont handle clicks if the game is over
    if (gameOver) {
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

    if (revealed === 90) {
      console.log("win");
      setWinTime(gameTime);
      setGameOver(true);
      setBoard(flagAllBombs(sortedUpdatedBoard));
      setCanSendHighscore(true);
    }

    setBoard(sortedUpdatedBoard);
    setNRevealed(revealed);
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onKeyDown={() => placeFlag()}
    >
      <div className="mt-2 mb-2 text-2xl text-slate-700 font-bold">
        {!gameOver ? (
          <Timer time={gameTime} />
        ) : winTime ? (
          <Timer time={winTime} />
        ) : (
          "Game Over!"
        )}
      </div>
      <div className=" text-2xl text-slate-700 font-bold">
        {!winTime ? `Tiles left to clear: ${90 - nRevealed}` : "You Win!"}
      </div>
      <div className="grid grid-cols-10 grid-rows-10">
        {board.map((tile, idx) => (
          <Tile
            key={idx}
            tile={tile}
            onClick={() => handleClick(tile)}
            onHover={() => handleHover(tile)}
            board={board}
          />
        ))}
      </div>
      {gameOver && (
        <div className="w-96 h-48 z-10 absolute top-auto border-2 border-dashed rounded-md bg-slate-100 shadow-lg flex flex-col justify-center items-center">
          <div className="mb-2 text-2xl font-bold">
            {(winTime / 1000).toFixed(2)}s
          </div>
          <input
            autoFocus
            placeholder="Player name"
            className=" bg-slate-100 font-semibold mb-2 border-b-2 text-center text-lg focus:outline-none"
            value={playerName}
            onChange={({ target }) => setPlayerName(target.value)}
          />
          <div className="w-full h-12 flex justify-center items-center">
            {canSendHighscore ? (
              <button
                className="font-semibold border-2 border-dashed rounded m-1 p-1 pl-2 pr-2 mt-2 bg-gray-300 hover:border-4 hover:border-slate-500 hover:rounded-lg hover:shadow-lg active:scale-90 active:rounded-xl active:shadow-sm
        cursor-pointer transition-all duration-75 flex flex-row justify-center items-center"
                onClick={handleSendHighscore}
                disabled={!canSendHighscore}
              >
                Submit highscore
              </button>
            ) : (
              <BsCheckCircle size={24} />
            )}
          </div>
          <div className="w-full h-12 flex justify-center items-center">
            <button
              className="font-semibold border-2 border-dashed rounded m-1 p-1 pl-2 pr-2 mt-2 bg-gray-300 hover:border-4 hover:border-slate-500 hover:rounded-lg hover:shadow-lg active:scale-90 active:rounded-xl active:shadow-sm
              cursor-pointer transition-all duration-75"
              onClick={restartGame}
            >
              Retry
            </button>
          </div>
          <div className="w-full h-12 flex justify-center items-center">
            <Link to="/highscores">View highscores</Link>
          </div>
        </div>
      )}
      {/* <div className="mt-2 text-xl text-slate-700 font-thin">
        Press {"<<"} F {">>"} to place flag!
      </div> */}
    </div>
  );
}

export default Game;
