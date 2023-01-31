import { Board, Gamemode, GameState, TileType } from "../types";
import { countRevealedTiles, startFloodFill } from "../utils/gameUtils";
import { boardActions, gameStateActions } from "../redux/gameStateSlice";
import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";

export const handleClickTile = (
  tile: TileType,
  gameState: GameState,
  board: Board,
  dispatch: ThunkDispatch<
    {
      gameState: GameState;
      board: Board;
    },
    undefined,
    AnyAction
  > &
    Dispatch<AnyAction>,
  handleRetryGame: (board: Board, currentGamemode: Gamemode) => void
) => {
  const REFRESH_RATE = 1000;

  const {
    setGameTime,
    startGame: startGameAction,
    winGame,
    setNumPlacedMarkers,
    setAvailableLighthouses,
    setLighthouseMode,
    setGameOver,
  } = gameStateActions;

  const { setBoard, revealBoard, setNumRevealedTiles, markTile } = boardActions;

  const startGame = () => {
    // start game

    // clear old timer
    clearInterval(gameState.intervalId); // clear timer first

    // get timestamp for calculating game time
    const startTimestamp = Date.now();

    // set game timer interval
    const gameInterval = setInterval(() => {
      dispatch(setGameTime(Date.now() - startTimestamp));
    }, REFRESH_RATE);

    dispatch(
      startGameAction({
        intervalId: gameInterval,
        gameStartTimestamp: startTimestamp,
      })
    );
    dispatch(setNumRevealedTiles(0));
  };

  // check for win conditions on current board
  const checkWinConditions = (boardToCheck: Board) => {
    // count revealed tiles
    const numRevealedTiles = countRevealedTiles(boardToCheck);

    // side effect
    // not very pure bro
    // update game state
    dispatch(setNumRevealedTiles(numRevealedTiles));

    if (numRevealedTiles >= board.numWaterTiles - board.numBombs) {
      // win
      dispatch(winGame());
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

  if (tile.marked && !gameState.markerMode) {
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
    const placed = gameState.numPlacedMarkers + (tile.marked ? -1 : 1);
    dispatch(setNumPlacedMarkers(placed));

    // toggle tile
    // tile.marked = !tile.marked;
    dispatch(markTile({ id: tile.id }));

    return;
  }

  if (gameState.lighthouseMode) {
    // handle lighthouse mode
    if (tile.type === 1 && gameState.availableLighthouses > 0) {
      // check if on land
      // set lighthouse
      // filters and map ids of the tiles directly surrounding the lighthouse,
      // max 8 ignore self
      const litTileIds = board.tiles
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
      const newTiles = board.tiles.map((t) =>
        t.id === tile.id ? { ...t, lighthouse: true } : t
      );
      // maps lit tiles
      const litTiles = newTiles.map((t) =>
        litTileIds.includes(t.id) ? { ...t, revealed: true, lit: true } : t
      );

      // decrement available lighthouses
      dispatch(setAvailableLighthouses(gameState.availableLighthouses - 1));

      if (gameState.availableLighthouses < 1) {
        // disables lighthouse mode if no more lighthouses are available
        dispatch(setLighthouseMode(false));
      }

      // count water tiles
      const numWaterTiles = litTiles.filter((tile) => tile.type !== 1).length;

      const newBoard: Board = {
        ...board,
        tiles: litTiles,
        numWaterTiles,
      };

      // check if the placed lighthouse has won the game
      checkWinConditions(newBoard);

      // update board
      dispatch(setBoard(newBoard));
      // update number of revealed tiles
      const numRevealedTiles = countRevealedTiles(newBoard);
      dispatch(setNumRevealedTiles(numRevealedTiles));

      return;
    } else {
      // disable lighthouseMode
      // dispatch({
      //   type: Types.SET_LIGHTHOUSE_MODE,
      //   payload: { lighthouseMode: false },
      // });
      dispatch(setLighthouseMode(false));
    }
  }

  if (!gameState.gameStarted) {
    // start game if not already started
    if (tile.bomb) {
      // never start on bomb
      // quickly repopulate board
      // TODO: PREVENT HAVING TO DOUBLE CLICK
      handleRetryGame(board, gameState.currentGamemode);

      tile.revealed = true;
      return;
    }

    startGame();
  }

  // if bomb is clicked setGameOver
  if (tile.bomb && gameState.gameStarted) {
    // trigger game over

    dispatch(setGameOver(true));
    // get the final time

    dispatch(setGameTime(Date.now() - gameState.gameStartTimestamp));
    // reveal all tiles on board
    dispatch(revealBoard(board));

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
    tileIdsToReveal = startFloodFill(tile, board.tiles, tileIdsToReveal);
  }

  // reveal tiles and update board
  const revealedTiles = board.tiles.map((t) =>
    tileIdsToReveal.includes(t.id) ? { ...t, revealed: true } : t
  );

  // sort board by id
  const sortedRevealedTiles = revealedTiles.sort((a, b) => a.id - b.id);

  const newBoard: Board = { ...board, tiles: sortedRevealedTiles };

  // check win
  checkWinConditions(newBoard);

  // update board
  dispatch(setBoard(newBoard));
  // update number of revealed tiles

  const numRevealedTiles = countRevealedTiles(newBoard);
  dispatch(setNumRevealedTiles(numRevealedTiles));
};
