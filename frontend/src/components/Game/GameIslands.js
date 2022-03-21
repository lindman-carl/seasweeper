import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
import { GiBroom } from "react-icons/gi";
import { GiBuoy } from "react-icons/gi";
import { SiLighthouse } from "react-icons/si";
import { ClipLoader } from "react-spinners";
import IconBadge from "./IconBadge";
import ReactTooltip from "react-tooltip";
import GamemodeCarousel from "./GamemodeCarousel";

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
  gamemodes,
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

  // gamemode carousel
  const [gamemodeCarousel, setGamemodeCarousel] = useState(false);

  // react router
  const navigate = useNavigate();

  const refreshRate = 100;

  const generateIslandMap = async () => {
    // generate a map and make a game board out of it
    // creates the map async, to keep the app responsive
    const tempMap = await generateValidMergedMap(w, h, nIslands, clusterSpread);
    const tempBoard = await gameUtils.populateGeneratedMap(nBombs, tempMap);
    const nSeaTiles = tempBoard.filter((t) => t.type !== 1).length;
    console.log("nseatiles", nSeaTiles);
    // set states
    setBoard(tempBoard);
    setSeaTiles(nSeaTiles);
  };

  const generateOpenseaMap = () => {
    const blankMap = gameUtils.populateBoard(w, h, nBombs);
    const nSeaTiles = w * h;
    // states
    setBoard(blankMap);
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
    clearInterval(intervalId);

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

    // if (!lighthouseMode && tile.type === 1) {
    //   return null;
    // }

    // markMode
    if (markMode) {
      // if water, toggle marked
      if (tile.type === 2) {
        tile.marked = !tile.marked;
      }
      // do nothing if land
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

        // maps lighthouse to tile
        const newMap = board.map((t) =>
          t.id === tile.id ? { ...t, lighthouse: true } : t
        );
        // maps lit tiles
        const litMap = newMap.map((t) =>
          litTiles.includes(t.id) ? { ...t, revealed: true, lit: true } : t
        );

        // decrement available lighthouses
        setAvailableLighthouses((prev) => prev - 1);

        // toggles lighthouse mode if no more lighthouses are available
        if (availableLighthouses < 1) {
          setLighthouseMode(false);
        }

        // check if the placed lighthouse has won the game
        checkWinConditions(litMap);

        // update board
        setBoard(litMap);
        setNRevealed(countRevealed(litMap)); // update number of revealed tile
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
        restartGame();
        startGame();
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

    // handle reveal and floodfill
    const copiedBoard = [...board];
    // use array to reveal all tiles at the same time
    let tilesToReveal = [];

    // reveal this tile
    tilesToReveal.push(tile.id);

    if (tile.count === 0) {
      // start flood fill algo if the tile has no neighbouring bombs
      tilesToReveal = gameUtils.startFloodFill(tile, board, tilesToReveal);
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
    setBoard(sortedUpdatedBoard);

    // rerender map after click
    // renderMap();
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

  const handleSelectGamemode = (link) => {
    console.log("navigate to", link);
    setGamemodeCarousel(false);
    navigate(link, { replace: true });
    window.location.reload();
  };

  const handleCloseSelectGamemode = () => {
    setGamemodeCarousel(false);
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
        <div className="w-full h-16 my-2 px-2 sm:px-20 flex flex-row justify-between items-center ">
          <div className="flex w-64 flex-row mt-1 justify-start items-center grow">
            <div className="mr-1">
              <IconBadge
                icon={<FaBomb size={20} />}
                value={nBombs}
                tooltip={"Number of bombs remaining in the sea"}
              />
            </div>
            <div className="ml-1">
              <IconBadge
                icon={<BiSquare size={20} />}
                value={seaTiles - nRevealed - nBombs}
                tooltip={"Number of tiles left to clear"}
              />
            </div>
          </div>
          <div className="w-64 flex flex-row justify-center ">
            <div className="text-3xl text-sky-900 font-bold">
              {gameStarted ? (
                !gameOver ? (
                  <Timer time={gameTime} />
                ) : win ? (
                  "You win!"
                ) : (
                  "Game over!"
                )
              ) : (
                <div className="mb-3">
                  <Logo size={"sm"} />
                </div>
              )}
            </div>
          </div>
          <div className="w-64 flex flex-row justify-end items-center">
            <div className="mr-1">
              <IconCheckbox
                icon={<SiLighthouse size={28} />}
                status={lighthouseMode}
                value={availableLighthouses}
                onClick={handleLighthouseMode}
                tooltip={"Toogle place lighthouse mode"}
              />
            </div>
            <div className="ml-1">
              <IconCheckbox
                icon={<GiBroom size={36} className="mr-1" />}
                alternateIcon={<GiBuoy size={36} />}
                status={markMode}
                onClick={handleMarkMode}
                tooltip={"Toggle between mark and sweep mode"}
              />
            </div>
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
        {gamemodeCarousel && (
          <GamemodeCarousel
            name={name}
            gamemodes={gamemodes}
            handleSelectGamemode={handleSelectGamemode}
            handleCloseSelectGamemode={handleCloseSelectGamemode}
          />
        )}
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
          your head!{" "}
          <button
            className="font-medium underline"
            onClick={() => setGamemodeCarousel(true)}
          >
            Select gamemode
          </button>
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
