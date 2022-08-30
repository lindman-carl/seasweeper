import React, { useState, useEffect } from "react";

// types
import { TileType } from "../../types";

// utils
import gameUtils from "./gameUtils";
import { postHighscore } from "./apiUtils";
import { generateValidMergedMap } from "./islandMapGenerator";

// components
import Hud from "./Hud";
import Tile from "./Tile";
import GameOverBox from "./GameOverBox";
import ScrollDownArrow from "./ScrollDownArrow";
import GeneratingMapSpinner from "./GeneratingMapSpinner";

type Props = {
  gamemodeObject: any;
  handleToggleGamemodeCarousel: () => void;
  handleRefetchHighscores: () => void;
  children: JSX.Element | JSX.Element[];
};

const GameBoard = ({
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
  handleRefetchHighscores,
  children,
}: Props) => {
  // map state
  const [currentBoard, setCurrentBoard] = useState<TileType[]>(board);
  const [numRevealed, setNumRevealed] = useState<number>(0);
  const [numMarkers, setNumMarkers] = useState<number>(0);
  const [numWaterTiles, setNumWaterTiles] = useState<number>(
    board?.filter ? board.filter((t: TileType) => t.type !== 1).length : 0
  ); // calculates number of water tiles

  // game state
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);
  const [gameTime, setGameTime] = useState<number>(0);
  const [startUnixTimestamp, setStartUnixTimestamp] = useState<number>(0);

  const [lighthouseMode, setLighthouseMode] = useState<boolean>(false);
  const [markMode, setMarkMode] = useState<boolean>(false);
  const [availableLighthouses, setAvailableLighthouses] =
    useState<number>(nLighthouses);

  // etc, states
  const [intervalId, setIntervalId] = useState<any>();
  const [isSendingHighscore, setIsSendingHighscore] = useState<boolean>(false);

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
    const tempMap = await generateValidMergedMap(
      w,
      h,
      nIslands,
      clusterSpread,
      0.6
    );
    const tempBoard = await gameUtils.populateGeneratedMap(numBombs, tempMap);
    const countWaterTiles = tempBoard.filter((t) => t.type !== 1).length;

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

  const depopulateBoard = (boardToDepopulate: TileType[]) => {
    // remove all bombs and player interactions from board
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

  const repopulateBoard = async () => {
    // generate new bombs on board
    // dont generate islands on open sea
    if (nIslands < 0) {
      generateOpenseaMap();
      return;
    }
    // remove all bombs from board
    const depopulatedBoard = depopulateBoard(currentBoard);
    // generate new bombs to board
    const repopulatedBoard = gameUtils.populateBombs({
      board: depopulatedBoard,
      width: w,
      height: h,
      nBombs: numBombs,
    });
    // reset the water tiles count
    const countWaterTiles = repopulatedBoard.filter((t) => t.type !== 1).length;
    // hide/unreveal all tiles
    const unrevealedBoard = unrevealAll(repopulatedBoard);
    // states
    setCurrentBoard(unrevealedBoard);
    setNumWaterTiles(countWaterTiles);
  };

  useEffect(() => {
    // clear interval on unmount
    return () => {
      clearInterval(intervalId);
    };

    // why if I only want on mount???
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const winGame = () => {
    setWin(true);
    setGameTime(Date.now() - startUnixTimestamp);
    setGameOver(true);
    clearInterval(intervalId);
  };

  // reset game
  const resetGame = async () => {
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

    // unix timestamp
    setStartUnixTimestamp(Date.now());

    // store intervalId
    setIntervalId(gameInterval);
  };

  // generate new map and restart game
  const newGame = async () => {
    await generateMap();
    resetGame();
  };

  // repopulate board and restart game
  const retryGame = async () => {
    await repopulateBoard();
    resetGame();
  };

  // counts number of revealed
  const countRevealed = (boardToCount: TileType[]) => {
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
  const unrevealAll = (boardToUnreveal: TileType[]) => {
    const unrevealedBoard = boardToUnreveal.map((t) =>
      t.type === 2 ? { ...t, revealed: false } : t
    );
    return unrevealedBoard;
  };

  // check for win conditions on current board
  const checkWinConditions = (boardToCheck: TileType[]) => {
    const revealed = countRevealed(boardToCheck);
    setNumRevealed(revealed);

    // win
    if (revealed >= numWaterTiles - numBombs) {
      // setWin(true);
      winGame();
    }
  };

  // event handlers
  const handleSendHighscore = async ({ playerName }: any) => {
    setIsSendingHighscore(true); // trigger loading animation

    await postHighscore(gameTime, playerName, name);
    // const postedHighscore = await postHighscore(gameTime, playerName, name);
    // console.log("posted highscore", postedHighscore);

    setIsSendingHighscore(false); // untrigger loading animation

    handleRefetchHighscores(); // refetch highscore list
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
   * @param {TileType} Tile clicked on
   */
  const handleClick = (tile: TileType) => {
    // dont handle clicks if the game is over
    if (gameOver) {
      clearInterval(intervalId);
      return null;
    }

    // ignore clicks if gamemode carousel is showing
    if (showGamemodeCarousel) {
      return null;
    }

    // ignore clicks if tile is land and it's not lighthouse mode
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

        // maps lighthouse to tile
        const newMap = currentBoard.map((t) =>
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
      setGameTime(Date.now() - startUnixTimestamp);
      // reveal all
      setCurrentBoard(revealAll());
      clearInterval(intervalId);
      return null;
    }

    // handle reveal and floodfill
    const copiedBoard = [...currentBoard];
    // use array to reveal all tiles at the same time
    let tilesToReveal: number[] = [];

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
        <Tile key={idx} tile={tile} onClick={() => handleClick(tile)} />
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
    refetchHighscores: handleRefetchHighscores,
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

export default GameBoard;
