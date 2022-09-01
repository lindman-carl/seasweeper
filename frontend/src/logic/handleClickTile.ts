import { Dispatch } from "react";
import { GameStateActions, Types } from "../context/gameStateReducer";
import { Board, Gamemode, GameState, TileType } from "../types";
import { countRevealedTiles, startFloodFill } from "../utils/gameUtils";

export const handleClickTile = (
  tile: TileType,
  gameState: GameState,
  dispatch: Dispatch<GameStateActions>,
  handleRetryGame: (board: Board, currentGamemode: Gamemode) => void
) => {
  const REFRESH_RATE = 1000;

  const startGame = () => {
    // start game

    // clear old timer
    clearInterval(gameState.intervalId); // clear timer first

    // get timestamp for calculating game time
    const startTimestamp = Date.now();

    // set game timer interval
    const gameInterval = setInterval(() => {
      dispatch({
        type: Types.SET_GAME_TIME,
        payload: {
          gameTime: Date.now() - startTimestamp,
        },
      });
    }, REFRESH_RATE);

    dispatch({
      type: Types.START_GAME,
      payload: { intervalId: gameInterval, gameStartTimestamp: startTimestamp },
    });
  };

  // check for win conditions on current board
  const checkWinConditions = (boardToCheck: Board) => {
    // count revealed tiles
    const numRevealedTiles = countRevealedTiles(boardToCheck);

    // side effect
    // not very pure bro
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
      dispatch({
        type: Types.WIN_GAME,
        payload: {},
      });
    }
  };

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
    // handle marker mode
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

  if (gameState.lighthouseMode) {
    // handle lighthouse mode
    if (tile.type === 1 && gameState.availableLighthouses > 0) {
      // check if on land
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
  }

  if (!gameState.gameStarted) {
    // start game if not already started
    if (tile.bomb) {
      // never start on bomb
      // quickly repopulate board
      // TODO: PREVENT HAVING TO DOUBLE CLICK
      handleRetryGame(gameState.board, gameState.currentGamemode);

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
