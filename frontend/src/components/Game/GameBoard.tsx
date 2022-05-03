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

// hooks
import {
  GameStateActionType,
  useGameState,
} from "../../hooks/gameStateContext";

type Props = {
  handleToggleGamemodeCarousel: () => void;
  handleRefetchHighscores: () => void;
  children: JSX.Element | JSX.Element[];
};

const GameBoard = ({
  handleToggleGamemodeCarousel,
  handleRefetchHighscores,
  children,
}: Props) => {
  const { state, dispatch } = useGameState();

  // deconstruct gamemode
  const { board, nLighthouses, w, h, name, nIslands, clusterSpread, numBombs } =
    state.currentGamemode;
  console.log("this", board);

  // calculates number of water tiles
  const [numWaterTiles, setNumWaterTiles] = useState<number>(
    board?.filter ? board.filter((t: TileType) => t.type !== 1).length : 0
  );

  // etc, states
  const [intervalId, setIntervalId] = useState<any>();
  // const [isSendingHighscore, setIsSendingHighscore] = useState<boolean>(false);

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
    dispatch({
      type: GameStateActionType.SET_CURRENT_GAMEBOARD,
      payload: tempBoard,
    });
    setNumWaterTiles(countWaterTiles);
  };

  const generateOpenseaMap = () => {
    const blankMap = gameUtils.populateBoard(w, h, numBombs);
    const countWaterTiles = w * h;

    // states
    dispatch({
      type: GameStateActionType.SET_CURRENT_GAMEBOARD,
      payload: blankMap,
    });
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
    const depopulatedBoard = depopulateBoard(state.currentGameBoard);
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
    dispatch({
      type: GameStateActionType.SET_CURRENT_GAMEBOARD,
      payload: unrevealedBoard,
    });
    setNumWaterTiles(countWaterTiles);
  };

  useEffect(() => {
    dispatch({
      type: GameStateActionType.SET_CURRENT_GAMEBOARD,
      payload: board,
    });
    // clear interval on unmount
    return () => {
      clearInterval(intervalId);
    };

    // why if I only want on mount???
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // restart game
  const restartGame = async () => {
    // resets game states
    dispatch({ type: GameStateActionType.SET_GAME_STARTED, payload: false });
    dispatch({ type: GameStateActionType.SET_GAME_OVER, payload: false });
    dispatch({ type: GameStateActionType.SET_GAME_WIN, payload: false });
    dispatch({ type: GameStateActionType.SET_GAME_TIME, payload: 0 });
    dispatch({ type: GameStateActionType.SET_NUM_MARKERS, payload: 0 });
    dispatch({
      type: GameStateActionType.SET_AVAILABLE_LIGHTHOUSES,
      payload: nLighthouses,
    });

    // clear timer
    clearInterval(intervalId);
  };

  // start game
  const startGame = () => {
    // setNumRevealed(0);
    dispatch({ type: GameStateActionType.SET_NUM_REVEALED, payload: 0 });
    // setGameStarted(true);
    dispatch({ type: GameStateActionType.SET_GAME_STARTED, payload: true });

    // set timer
    clearInterval(intervalId); // clear timer first

    // get timestamp for calculating game time
    const startTime = Date.now();

    // set game timer interval
    const gameInterval = setInterval(() => {
      dispatch({
        type: GameStateActionType.SET_GAME_TIME,
        payload: Date.now() - startTime,
      });
    }, refreshRate);

    // store intervalId
    setIntervalId(gameInterval);
  };

  // generate new map and restart game
  const newGame = async () => {
    await generateMap();
    restartGame();
  };

  // repopulate board and restart game
  const retryGame = async () => {
    await repopulateBoard();
    restartGame();
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
    const revealedBoard = state.currentGameBoard.map((t: TileType) =>
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
    // setNumRevealed(revealed);
    dispatch({ type: GameStateActionType.SET_NUM_REVEALED, payload: revealed });

    // win
    if (revealed >= numWaterTiles - numBombs) {
      // setWin(true);
      dispatch({ type: GameStateActionType.SET_GAME_WIN, payload: true });
      // setGameOver(true);
      dispatch({ type: GameStateActionType.SET_GAME_OVER, payload: true });
      clearInterval(intervalId);
    }
  };

  // event handlers
  const handleSendHighscore = async ({ playerName }: any) => {
    // trigger loading animation
    dispatch({
      type: GameStateActionType.SET_IS_SENDING_HIGHSCORE,
      payload: true,
    });

    await postHighscore(state.gameTime, playerName, name);
    // const postedHighscore = await postHighscore(gameTime, playerName, name);
    // console.log("posted highscore", postedHighscore);

    // untrigger loading animation
    dispatch({
      type: GameStateActionType.SET_IS_SENDING_HIGHSCORE,
      payload: false,
    });

    handleRefetchHighscores(); // refetch highscore list
  };

  // eventhandler for clicking lighthouse mode button
  const handleLighthouseMode = () => {
    // available lighthouses
    if (state.availableLighthouses > 0) {
      // setLighthouseMode(!lighthouseMode);
      dispatch({
        type: GameStateActionType.SET_LIGHTHOUSE_MODE,
        payload: !state.lighthouseMode,
      });
      // disable mark mode
      // setMarkMode(false);
      dispatch({
        type: GameStateActionType.SET_MARK_MODE,
        payload: false,
      });
    }
  };

  // eventhandler for clicking mark mode button
  const handleMarkMode = () => {
    // setMarkMode(!markMode);
    dispatch({
      type: GameStateActionType.SET_MARK_MODE,
      payload: !state.markMode,
    });
    // disable lighthouse mode
    // setLighthouseMode(false);
    dispatch({
      type: GameStateActionType.SET_LIGHTHOUSE_MODE,
      payload: false,
    });
  };

  /**
   * Click tile eventhandler
   * @param {TileType} Tile clicked on
   */
  const handleClick = (tile: TileType) => {
    // dont handle clicks if the game is over
    if (state.gameOver) {
      clearInterval(intervalId);
      return null;
    }

    // ignore clicks if gamemode carousel is showing
    if (state.showGamemodeCarousel) {
      return null;
    }

    // ignore clicks if tile is land and it's not lighthouse mode
    if (!state.lighthouseMode && tile.type === 1) {
      return null;
    }

    // markMode
    if (state.markMode) {
      // if water, toggle marked
      if (tile.type === 2) {
        if (!tile.revealed) {
          if (!tile.marked) {
            // setNumMarkers((prev) => prev + 1);
            dispatch({
              type: GameStateActionType.SET_NUM_MARKERS,
              payload: state.numMarkers + 1,
            });
          } else {
            // setNumMarkers((prev) => prev - 1);
            dispatch({
              type: GameStateActionType.SET_NUM_MARKERS,
              payload: state.numMarkers - 1,
            });
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
    if (state.lighthouseMode) {
      // check if on land
      if (tile.type === 1 && state.availableLighthouses > 0) {
        // set lighthouse
        // filters and map ids of the tiles directly surrounding the lighthouse,
        // max 8 ignore self
        const litTiles = state.currentGameBoard
          .filter(
            (t: TileType) =>
              t.x >= tile.x - 1 &&
              t.x <= tile.x + 1 &&
              t.y >= tile.y - 1 &&
              t.y <= tile.y + 1 &&
              t.id !== tile.id &&
              t
          )
          .map((t: TileType) => t.id);

        // maps lighthouse to tile
        const newMap = state.currentGameBoard.map((t: TileType) =>
          t.id === tile.id ? { ...t, lighthouse: true } : t
        );
        // maps lit tiles
        const litMap = newMap.map((t: TileType) =>
          litTiles.includes(t.id) ? { ...t, revealed: true, lit: true } : t
        );

        // decrement available lighthouses
        // setAvailableLighthouses((prev) => prev - 1);
        dispatch({
          type: GameStateActionType.SET_AVAILABLE_LIGHTHOUSES,
          payload: state.availableLighthouses - 1,
        });

        // toggles lighthouse mode if no more lighthouses are available
        if (state.availableLighthouses < 1) {
          // setLighthouseMode(false);
          dispatch({
            type: GameStateActionType.SET_LIGHTHOUSE_MODE,
            payload: false,
          });
        }

        // check if the placed lighthouse has won the game
        checkWinConditions(litMap);

        // update board
        dispatch({
          type: GameStateActionType.SET_CURRENT_GAMEBOARD,
          payload: litMap,
        });
        // update number of revealed tile
        // setNumRevealed(countRevealed(litMap));
        dispatch({
          type: GameStateActionType.SET_NUM_REVEALED,
          payload: countRevealed(litMap),
        });

        return null;
      } else {
        // toggle lighthouseMode
        // setLighthouseMode(false);
        dispatch({
          type: GameStateActionType.SET_LIGHTHOUSE_MODE,
          payload: false,
        });
      }
    } else if (tile.type === 1) {
      return null;
    }

    // start game if not already started
    if (!state.gameStarted) {
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
    if (tile.bomb && state.gameStarted) {
      // setGameOver(true);
      dispatch({ type: GameStateActionType.SET_GAME_OVER, payload: true });
      // reveal all
      dispatch({
        type: GameStateActionType.SET_CURRENT_GAMEBOARD,
        payload: revealAll(),
      });
      clearInterval(intervalId);
      return null;
    }

    // handle reveal and floodfill
    const copiedBoard = [...state.currentGameBoard];
    // use array to reveal all tiles at the same time
    let tilesToReveal: number[] = [];

    // reveal this tile
    tilesToReveal.push(tile.id);

    if (tile.count === 0) {
      // start flood fill algo if the tile has no neighbouring bombs
      tilesToReveal = gameUtils.startFloodFill(
        tile,
        state.currentGameBoard,
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
    dispatch({
      type: GameStateActionType.SET_CURRENT_GAMEBOARD,
      payload: sortedUpdatedBoard,
    });
  };

  /**
   *
   * @returns map rendered with flex box
   */
  const renderMap = () => {
    console.log("render", state.currentGameBoard);
    if (state.currentGameBoard === undefined) return null;
    const rows = [];
    for (let y = 0; y < h; y++) {
      // iterate y axis
      const row = state.currentGameBoard
        .filter((t: TileType) => t.y === y)
        .sort((a: TileType, b: TileType) => a.x - b.x);
      const mappedRow = row.map((tile: TileType, idx: number) => (
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
    numWaterTiles,
    handleLighthouseMode,
    handleMarkMode,
    handleToggleGamemodeCarousel,
  };

  const gameOverBoxProps = {
    handleSendHighscore,
    handleNewGame: newGame,
    handleRetry: retryGame,
    newAvailable: nIslands > 0,
    refetchHighscores: handleRefetchHighscores,
  };

  // render game if finished generating maps
  return (
    <div className="game-board-container">
      {children}
      <Hud {...hudProps} />

      <div className="flex flex-col ">
        {state.currentGameBoard ? renderMap() : "lol"}
      </div>

      {state.gameOver && <GameOverBox {...gameOverBoxProps} />}
      <ScrollDownArrow />
    </div>
  );
};

export default GameBoard;
