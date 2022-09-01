import React, { useEffect } from "react";

// types
import { Board, Gamemode, TileType } from "../../types";

// utils
import {
  countRevealedTiles,
  gamemodes,
  getGamemodeById,
  startFloodFill,
} from "../../utils/gameUtils";
import {
  generateBoardForSpecificGamemode,
  generateBoardsForAllGamemodes,
} from "../../utils/boardGeneration";

import { postHighscore } from "../../utils/apiUtils";

// components
import BoardComponent from "./BoardComponent";
import GamemodeCarousel from "./GamemodeCarousel";
import GameOverBox from "./GameOverBox";
import GeneratingMapSpinner from "./GeneratingMapSpinner";
import Hud from "./Hud";
import ScrollDownArrow from "./ScrollDownArrow";

// context
import { useGameState } from "../../context/gameStateContext";
import { Types } from "../../context/gameStateReducer";

const REFRESH_RATE = 100; // sets timer accuracy

type Props = {
  handleRefetchHighscores: () => void;
  setHighscoresMapFilter: (name: string) => void;
};

const Game = ({ handleRefetchHighscores, setHighscoresMapFilter }: Props) => {
  // state
  const { state: gameState, dispatch } = useGameState();

  // useEffect
  useEffect(() => {
    const generateAllGamemodeBoards = async () => {
      // generates initial maps for gamemodes
      const newGamemodes = await generateBoardsForAllGamemodes(gamemodes);

      // get current gamemode
      const currentGamemode =
        newGamemodes.find((gm) => gm.id === gameState.currentGamemode.id) ||
        gamemodes[0];

      // update gamemodes and set board
      dispatch({
        type: Types.SET_BOARD,
        payload: { board: currentGamemode.board },
      });
      dispatch({
        type: Types.SET_GAMEMODES,
        payload: { gamemodes: newGamemodes },
      });
    };

    generateAllGamemodeBoards();

    // clear interval on unmount
    return () => {
      clearInterval(gameState.intervalId);
    };

    // why if I only want on mount???
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const winGame = () => {
    dispatch({
      type: Types.SET_GAME_WIN,
      payload: { gameWin: true },
    });
    dispatch({
      type: Types.SET_GAME_OVER,
      payload: { gameOver: true },
    });
    dispatch({
      type: Types.SET_GAME_TIME,
      payload: { gameTime: Date.now() - gameState.gameStartTimestamp },
    });

    // clear timer interval
    clearInterval(gameState.intervalId);
  };

  // reset game
  const resetGame = async () => {
    // resets game states
    dispatch({
      type: Types.SET_GAME_STARTED,
      payload: { gameStarted: false },
    });
    dispatch({
      type: Types.SET_GAME_OVER,
      payload: { gameOver: false },
    });
    dispatch({
      type: Types.SET_GAME_WIN,
      payload: { gameWin: false },
    });
    dispatch({
      type: Types.SET_GAME_TIME,
      payload: { gameTime: 0 },
    });
    dispatch({
      type: Types.SET_NUM_PLACED_MARKERS,
      payload: { numPlacedMarkers: 0 },
    });
    dispatch({
      type: Types.SET_AVAILABLE_LIGHTHOUSES,
      payload: { availableLighthouses: gameState.currentGamemode.nLighthouses },
    });

    // clear timer interval
    clearInterval(gameState.intervalId);
  };

  const startGame = () => {
    // start game
    dispatch({
      type: Types.SET_NUM_REVEALED_TILES,
      payload: { numRevealedTiles: 0 },
    });
    dispatch({
      type: Types.SET_GAME_STARTED,
      payload: { gameStarted: true },
    });

    // set timer
    clearInterval(gameState.intervalId); // clear timer first

    // get timestamp for calculating game time
    const tempTime = Date.now();

    // set game timer interval
    const gameInterval = setInterval(() => {
      dispatch({
        type: Types.SET_GAME_TIME,
        payload: { gameTime: Date.now() - tempTime },
      });
    }, REFRESH_RATE);

    // start timestamp
    dispatch({
      type: Types.SET_GAME_START_TIMESTAMP,
      payload: { gameStartTimestamp: Date.now() },
    });

    // store intervalId
    dispatch({
      type: Types.SET_INTERVAL_ID,
      payload: { intervalId: gameInterval },
    });
  };

  // generate new map and restart game
  const newGame = (gamemode: Gamemode) => {
    // generate a new board,
    // and reset game
    dispatch({
      type: Types.GENERATE_NEW_BOARD,
      payload: { gamemode },
    });
    // reset
    resetGame();
  };

  const retryGame = (board: Board, gamemode: Gamemode) => {
    resetGame();

    dispatch({
      type: Types.REPOPULATE_BOARD,
      payload: {
        board,
        gamemode,
      },
    });
  };

  // check for win conditions on current board
  const checkWinConditions = (boardToCheck: Board) => {
    // count revealed tiles
    const numRevealedTiles = countRevealedTiles(boardToCheck);
    // update game state
    dispatch({
      type: Types.SET_NUM_REVEALED_TILES,
      payload: { numRevealedTiles },
    });

    if (
      numRevealedTiles >=
      gameState.board.numWaterTiles - gameState.board.numBombs
    ) {
      // win
      winGame();
    }
  };

  // event handlers
  // const handleRegenerateGamemodeBoard = (id: number) => {
  //   // generate a new map for the selected gamemode
  //   const updatedGamemodes = generateBoardForSingleGamemode(
  //     gameState.gamemodes,
  //     id
  //   );

  //   // update gamemodes
  //   dispatch({
  //     type: Types.SET_GAMEMODES,
  //     payload: { gamemodes: updatedGamemodes },
  //   });
  // };

  const handleSendHighscore = async ({ playerName }: any) => {
    // trigger loading animation
    dispatch({
      type: Types.SET_IS_SENDING_HIGHSCORE,
      payload: { isSendingHighscore: true },
    });

    await postHighscore(gameState.gameTime, playerName, gameState.name);

    // untrigger loading animation
    dispatch({
      type: Types.SET_IS_SENDING_HIGHSCORE,
      payload: { isSendingHighscore: false },
    });

    // refetch highscore list
    handleRefetchHighscores();
  };

  const handleSelectGamemode = async (id: number) => {
    // sets current gamemode to id and generates a new board
    const currentGamemode = getGamemodeById(gameState.gamemodes, id);
    // generate a new map for the selected gamemode
    const newGamemodes = await generateBoardForSpecificGamemode(
      gameState.gamemodes,
      id
    );

    // set current gamemode
    dispatch({
      type: Types.SET_CURRENT_GAMEMODE,
      payload: { currentGamemode },
    });
    // set board
    dispatch({
      type: Types.SET_BOARD,
      payload: { board: currentGamemode.board },
    });
    // set gamemodes
    dispatch({
      type: Types.SET_GAMEMODES,
      payload: { gamemodes: newGamemodes },
    });
    // close carousel
    dispatch({
      type: Types.SET_SHOW_GAMEMODE_CAROUSEL,
      payload: { showGamemodeCarousel: false },
    });

    // update highscore filtering to match the selected gamemode
    setHighscoresMapFilter(currentGamemode.name);

    // reset game
    resetGame();
  };

  const handleClickTile = (tile: TileType) => {
    // handler for clicking game tiles

    if (gameState.gameOver) {
      // dont handle clicks if the game is over
      clearInterval(gameState.intervalId);
      return;
    }

    if (gameState.showGamemodeCarousel) {
      // ignore clicks if gamemode carousel is showing
      return;
    }

    if (!gameState.lighthouseMode && tile.type === 1) {
      // ignore clicks on land tiles if not in lighthouse mode
      return;
    }

    if (gameState.markerMode) {
      // handle mark mode
      if (tile.type !== 2) {
        // only mark water tiles
        return;
      }

      if (tile.revealed) {
        // only mark unrevealed tiles
        return;
      }

      // updated number of placed markers
      dispatch({
        type: Types.SET_NUM_PLACED_MARKERS,
        payload: {
          numPlacedMarkers: gameState.numPlacedMarkers + (tile.marked ? -1 : 1),
        },
      });

      // toggle tile
      tile.marked = !tile.marked;

      return;
    }

    // lighthouse mode
    if (gameState.lighthouseMode) {
      // check if on land
      if (tile.type === 1 && gameState.availableLighthouses > 0) {
        // set lighthouse
        // filters and map ids of the tiles directly surrounding the lighthouse,
        // max 8 ignore self
        const litTileIds = gameState.board.tiles
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
        const newTiles = gameState.board.tiles.map((t) =>
          t.id === tile.id ? { ...t, lighthouse: true } : t
        );
        // maps lit tiles
        const litTiles = newTiles.map((t) =>
          litTileIds.includes(t.id) ? { ...t, revealed: true, lit: true } : t
        );

        // decrement available lighthouses
        dispatch({
          type: Types.SET_AVAILABLE_LIGHTHOUSES,
          payload: { availableLighthouses: gameState.availableLighthouses - 1 },
        });

        if (gameState.availableLighthouses < 1) {
          // disables lighthouse mode if no more lighthouses are available
          dispatch({
            type: Types.SET_LIGHTHOUSE_MODE,
            payload: { lighthouseMode: false },
          });
        }

        // count water tiles
        const numWaterTiles = litTiles.filter((tile) => tile.type !== 1).length;

        const newBoard: Board = {
          ...gameState.board,
          tiles: litTiles,
          numWaterTiles,
        };

        // check if the placed lighthouse has won the game
        checkWinConditions(newBoard);

        // update board
        dispatch({
          type: Types.SET_BOARD,
          payload: { board: newBoard },
        });
        // update number of revealed tiles
        dispatch({
          type: Types.UPDATE_NUM_REVEALED_TILES,
          payload: { board: newBoard },
        });

        return;
      } else {
        // disable lighthouseMode
        dispatch({
          type: Types.SET_LIGHTHOUSE_MODE,
          payload: { lighthouseMode: false },
        });
      }
    } else if (tile.type === 1) {
      return;
    }

    if (!gameState.gameStarted) {
      // start game if not already started
      if (tile.bomb) {
        // never start on bomb
        // quickly repopulate board
        // TODO: PREVENT HAVING TO DOUBLE CLICK
        retryGame(gameState.board, gameState.currentGamemode);

        tile.revealed = true;
        return;
      }

      startGame();
    }

    // if bomb is clicked setGameOver
    if (tile.bomb && gameState.gameStarted) {
      // trigger game over
      dispatch({
        type: Types.SET_GAME_OVER,
        payload: { gameOver: true },
      });
      // get the final time
      dispatch({
        type: Types.SET_GAME_TIME,
        payload: { gameTime: Date.now() - gameState.gameStartTimestamp },
      });
      // reveal all tiles on board
      dispatch({
        type: Types.REVEAL_BOARD,
        payload: { board: gameState.board },
      });

      // clear timer
      clearInterval(gameState.intervalId);

      return;
    }

    // handle reveal and floodfill
    // store ids to reveal all tiles at the same time
    let tileIdsToReveal: number[] = [];

    // reveal this tile
    tileIdsToReveal.push(tile.id);

    if (tile.count === 0) {
      // start flood fill algo if the tile has no neighbouring bombs
      tileIdsToReveal = startFloodFill(
        tile,
        gameState.board.tiles,
        tileIdsToReveal
      );
    }

    // reveal tiles and update board
    const revealedTiles = gameState.board.tiles.map((t) =>
      tileIdsToReveal.includes(t.id) ? { ...t, revealed: true } : t
    );

    // sort board by id
    const sortedRevealedTiles = revealedTiles.sort((a, b) => a.id - b.id);

    const newBoard: Board = { ...gameState.board, tiles: sortedRevealedTiles };

    // check win
    checkWinConditions(newBoard);

    // update board
    dispatch({
      type: Types.SET_BOARD,
      payload: { board: newBoard },
    });
    // update number of revealed tiles
    dispatch({
      type: Types.UPDATE_NUM_REVEALED_TILES,
      payload: { board: newBoard },
    });
  };

  // props
  const gameOverBoxProps = {
    handleSendHighscore,
    handleRefetchHighscores,
    handleNewGame: newGame,
    handleRetry: retryGame,
  };

  const gamemodeCarouselProps = {
    handleSelectGamemode,
  };

  // render loading spinner while generating maps
  if (!gameState.board) return <GeneratingMapSpinner />;

  // render
  return (
    <div className="game-board-container">
      <GamemodeCarousel {...gamemodeCarouselProps} />
      <Hud />
      <BoardComponent
        board={gameState.board}
        handleClickTile={handleClickTile}
      />

      <GameOverBox {...gameOverBoxProps} />
      <ScrollDownArrow />
    </div>
  );
};

export default Game;
