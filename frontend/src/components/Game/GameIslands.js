import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import gameUtils from "./gameUtils";
import { generateValidMergedMap } from "./islandMapGenerator";

// components
import Timer from "./Timer";
import Tile from "./Tile";
import GameOverBox from "./GameOverBox";
import IconCheckbox from "./IconCheckbox";
import Logo from "../Logo";

// icons & animations
import { BiSquare } from "react-icons/bi";
import { FaBomb } from "react-icons/fa";
import { GiBroom, GiNewBorn } from "react-icons/gi";
import { GiBuoy } from "react-icons/gi";
import { SiLighthouse } from "react-icons/si";
import { ClipLoader } from "react-spinners";
import IconBadge from "./IconBadge";
import ReactTooltip from "react-tooltip";

// data fetching functions
const postHighscore = async (time, playerName, gameMode) => {
  const res = await axios.post("/api/highscores", {
    time,
    playerName: playerName.trim(),
    gameMode,
  });

  return res.data;
};

function Game({
  w,
  h,
  nIslands,
  clusterSpread,
  nBombs,
  refetchHighscore,
  nLighthouses = 2,
  name,
}) {
  // states, should use useReducer
  const [board, setBoard] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [intervalId, setIntervalId] = useState();
  const [win, setWin] = useState(false);
  const [nRevealed, setNRevealed] = useState(0);
  const [isSendingHighscore, setIsSendingHighscore] = useState(false);
  const [seaTiles, setSeaTiles] = useState(null);

  // lighthouseMode
  const [lighthouseMode, setLighthouseMode] = useState(false);
  const [availableLighthouses, setAvailableLighthouses] =
    useState(nLighthouses);

  // markMode
  const [markMode, setMarkMode] = useState(false);

  const refreshRate = 100;

  const generateMap = async () => {
    // generate a map and make a game board out of it
    const tempMap = await generateValidMergedMap(w, h, nIslands, clusterSpread);
    const tempBoard = await gameUtils.populateGeneratedMap(nBombs, tempMap);
    const nSeaTiles = tempBoard.filter((t) => t.type !== 1).length;
    console.log("nseatiles", nSeaTiles);
    // set states
    setBoard(tempBoard);
    setSeaTiles(nSeaTiles);
  };
  useEffect(() => {
    generateMap();
  }, []);

  const countRevealed = (boardToCount) => {
    const revealed = boardToCount.filter(
      (t) => t.type !== 1 && t.revealed && !t.bomb
    ).length;
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

  const restartGame = async () => {
    console.log("restartGame");
    await generateMap();
    setGameStarted(false);
    setGameOver(false);
    setGameTime(0);

    setWin(false);
    setAvailableLighthouses(nLighthouses);
  };

  const startGame = () => {
    console.log("startGame");
    setNRevealed(0);
    setGameStarted(true);

    // timer
    const tempTime = Date.now();
    setStartTime(tempTime);
    const gameInterval = setInterval(() => {
      setGameTime(Date.now() - tempTime);
    }, refreshRate);
    setIntervalId(gameInterval);
  };

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
      return null;
    }

    // markMode
    if (markMode) {
      // check if water
      if (tile.type === 2) {
        tile.marked = !tile.marked;
      }
      return null;
    }

    if (tile.marked) {
      return null;
    }

    // lighthouse mode
    if (lighthouseMode) {
      // check if on land
      if (tile.type === 1 && availableLighthouses > 0) {
        console.log("placing lighthouse");
        // set lighthouse
        // map ids that are directly around the lighthouse, max 8
        const litTiles = board
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

        const newMap = board.map((t) =>
          t.id === tile.id ? { ...t, lighthouse: true } : t
        );
        const litMap = newMap.map((t) =>
          litTiles.includes(t.id) ? { ...t, revealed: true, lit: true } : t
        );

        if (availableLighthouses <= 1) {
          setLighthouseMode(false);
        }

        setAvailableLighthouses((prev) => prev - 1);

        checkWinConditions(litMap);

        setBoard(litMap);
        setNRevealed(countRevealed(litMap));
      } else if (tile.type === 2) {
        console.log("cant place lighthouse on water");
      }
      return null;
    } else {
      if (tile.type === 1) {
        return null;
      }
    }

    // start game if not already started
    if (!gameStarted) {
      // never start on bomb
      if (tile.bomb) {
        console.log("boom");
        // repopulate board
        // startGame();
        return null;
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

    checkWinConditions(sortedUpdatedBoard);

    setBoard(sortedUpdatedBoard);

    renderMap();
  };

  const renderMap = () => {
    const rows = [];
    for (let y = 0; y < h; y++) {
      // iterate y axis
      const row = board.filter((t) => t.y === y).sort((a, b) => a.x - b.x);
      const mappedRow = row.map((tile, idx) => (
        <Tile
          key={idx}
          tile={tile}
          onClick={() => handleClick(tile)}
          board={board}
          markMode={markMode}
        />
      ));
      rows.push(mappedRow);
    }

    const rowsMapped = rows.map((row) => (
      <div className="flex flex-row justify-start items-start shrink">
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

  if (board) {
    return (
      <div
        className="
              w-screen min-h-screen
              lg:w-full
              bg-sky-50
              flex flex-col justify-start items-center"
      >
        <div className="w-full px-2 sm:px-20 flex flex-row justify-between items-center basis-0">
          <div className="flex flex-row justify-start grow">
            <IconBadge
              icon={<FaBomb size={20} />}
              value={nBombs}
              tooltip={"Number of bombs remaining in the sea"}
            />
            <IconBadge
              icon={<BiSquare size={20} />}
              value={seaTiles - nRevealed - nBombs}
              tooltip={"Number of tiles left to clear"}
            />
          </div>
          <div className="flex flex-row justify-center grow">
            <div className="mt-2 mb-2 text-3xl text-sky-900 font-bold">
              {gameStarted ? (
                !gameOver ? (
                  <Timer time={gameTime} />
                ) : win ? (
                  "You win!"
                ) : (
                  "Game over!"
                )
              ) : (
                <Logo size={"sm"} />
              )}
            </div>
          </div>
          <div className="flex flex-row justify-end grow">
            <IconCheckbox
              icon={<SiLighthouse size={28} />}
              status={lighthouseMode}
              value={availableLighthouses}
              onClick={handleLighthouseMode}
              tooltip={"Toogle place lighthouse mode"}
            />
            <IconCheckbox
              icon={<GiBroom size={36} className="mr-1" />}
              alternateIcon={<GiBuoy size={36} />}
              status={markMode}
              onClick={handleMarkMode}
              tooltip={"Toggle between mark and sweep mode"}
            />
          </div>
          <ReactTooltip id="badgeInfo" type="info" effect="solid" />
          <ReactTooltip
            id="checkboxInfo"
            type="info"
            effect="solid"
            delayShow={600}
            place="top"
          />
        </div>
        {board && <div className="flex flex-col">{renderMap()}</div>}
        {gameOver && (
          <GameOverBox
            gameTime={gameTime}
            win={win}
            handleSendHighscore={handleSendHighscore}
            isSendingHighscore={isSendingHighscore}
            handleRestartGame={restartGame}
          />
        )}
        <div className="mt-2 text-base md:text-lg text-slate-700 font-thin text-center">
          Click to reveal tile. Flags are for slow players, mark the mines in
          your head!
          <Link to="/opensea" className="font-medium underline">
            Play open sea
          </Link>
        </div>
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
}

export default Game;
