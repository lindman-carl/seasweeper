import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, Gamemode, GameState } from "../types";
import {
  depopulateBoard,
  generateBoard,
  generateBoardForSpecificGamemode,
  generateOpenSeaBoard,
  populateBombs,
} from "../utils/boardGeneration";
import {
  gamemodes,
  getGamemodeById,
  hideAllTiles,
  revealAllTiles,
} from "../utils/gameUtils";

export const initialGameState: GameState = {
  availableLighthouses: 0,
  currentGamemode: gamemodes[0],
  gamemodes,
  numPlacedMarkers: 0,
  gameStarted: false,
  gameOver: false,
  gameWin: false,
  gameTime: 0,
  gameStartTimestamp: Date.now(),
  lighthouseMode: false,
  markerMode: false,
  showGamemodeCarousel: false,
  isSendingHighscore: false,
  intervalId: null,
};

export const initialBoard = generateOpenSeaBoard();

export const boardSlice = createSlice({
  name: "board",
  initialState: initialBoard,
  reducers: {
    setBoard: (state: Board, action: PayloadAction<Board>) => {
      return { ...action.payload };
    },
    setNumWaterTiles: (state: Board, action: PayloadAction<number>) => {
      state.numWaterTiles = action.payload;
    },
    setNumRevealedTiles: (state: Board, action: PayloadAction<number>) => {
      state.numRevealedTiles = action.payload;
    },
    repopulateBoard: (state: Board, action: PayloadAction<Gamemode>) => {
      if (action.payload.nIslands === 0) {
        // open sea board
        // just create a new one
        // also this will never happen as the retry button is disabled
        const { width, height, numBombs } = action.payload;
        const blankBoard = generateOpenSeaBoard(width, height, numBombs);

        return { ...blankBoard };
      }
      // remove all bombs from board
      const depopulatedBoard = depopulateBoard(action.payload.board);
      // generate new bombs to board
      const repopulatedBoard = populateBombs(depopulatedBoard);
      // hide/unreveal all tiles
      const finalBoard = hideAllTiles(repopulatedBoard);

      return { ...finalBoard };
    },
    revealBoard: (state: Board, action: PayloadAction<Board>) => {
      const revealedBoard = revealAllTiles(action.payload);

      return { ...revealedBoard };
    },
    generateNewBoard: (state: Board, action: PayloadAction<Gamemode>) => {
      const newBoard = generateBoard(action.payload);

      return { ...newBoard };
    },
    markTile: (state: Board, action: PayloadAction<{ id: number }>) => {
      const tileToMark = state.tiles.find(
        (tile) => tile.id === action.payload.id
      );
      if (!tileToMark) {
        return;
      }
      tileToMark.marked = !tileToMark.marked;

      const updatedTiles = [
        ...state.tiles.filter((el) => el.id !== action.payload.id),
        tileToMark,
      ].sort((a, z) => a.id - z.id);

      state.tiles = updatedTiles;
    },
  },
});

export const gameStateSlice = createSlice({
  name: "gameState",
  initialState: initialGameState,
  reducers: {
    setCurrentGamemode: (state: GameState, action: PayloadAction<Gamemode>) => {
      state.currentGamemode = action.payload;
    },
    setGamemodes: (state: GameState, action: PayloadAction<Gamemode[]>) => {
      state.gamemodes = action.payload;
    },
    setAvailableLighthouses: (
      state: GameState,
      action: PayloadAction<number>
    ) => {
      state.availableLighthouses = action.payload;
    },
    setNumPlacedMarkers: (state: GameState, action: PayloadAction<number>) => {
      state.numPlacedMarkers = action.payload;
    },
    setGameStarted: (state: GameState, action: PayloadAction<boolean>) => {
      state.gameStarted = action.payload;
    },
    setGameOver: (state: GameState, action: PayloadAction<boolean>) => {
      state.gameOver = action.payload;
    },
    setGameWin: (state: GameState, action: PayloadAction<boolean>) => {
      state.gameWin = action.payload;
    },
    setLighthouseMode: (state: GameState, action: PayloadAction<boolean>) => {
      state.lighthouseMode = action.payload;
    },
    setMarkerMode: (state: GameState, action: PayloadAction<boolean>) => {
      state.markerMode = action.payload;
    },
    setShowGamemodeCarousel: (
      state: GameState,
      action: PayloadAction<boolean>
    ) => {
      state.showGamemodeCarousel = action.payload;
    },
    setGameTime: (state: GameState, action: PayloadAction<number>) => {
      if (!state.gameOver) {
        state.gameTime = action.payload;
      }
    },
    setGameStartTimestamp: (
      state: GameState,
      action: PayloadAction<number>
    ) => {
      state.gameStartTimestamp = action.payload;
    },
    setIntervalId: (state: GameState, action: PayloadAction<unknown>) => {
      state.intervalId = action.payload;
    },
    setIsSendingHighscore: (
      state: GameState,
      action: PayloadAction<boolean>
    ) => {
      state.isSendingHighscore = action.payload;
    },
    regenerateGamemodeBoard: (
      state: GameState,
      action: PayloadAction<number>
    ) => {
      const updatedGamemodes = generateBoardForSpecificGamemode(
        state.gamemodes,
        action.payload
      );
      state.gamemodes = [...updatedGamemodes];
    },
    resetGame: (state: GameState) => {
      state.gameStarted = false;
      state.gameOver = false;
      state.gameWin = false;
      state.gameTime = 0;
      state.numPlacedMarkers = 0;
      state.availableLighthouses = state.currentGamemode.nLighthouses;
    },
    selectGamemode: (state: GameState, action: PayloadAction<number>) => {
      const newCurrentGamemode = getGamemodeById(
        state.gamemodes,
        action.payload
      );
      const newGamemodes = generateBoardForSpecificGamemode(
        state.gamemodes,
        action.payload
      );

      state.currentGamemode = newCurrentGamemode;
      state.gamemodes = newGamemodes;

      state.showGamemodeCarousel = false;
    },
    startGame: (state: GameState, action: PayloadAction<any>) => {
      state.gameStarted = true;
      state.intervalId = action.payload.intervalId;
      state.gameStartTimestamp = action.payload.gameStartTimestamp;
    },
    winGame: (state: GameState) => {
      const finalTime = Date.now() - state.gameStartTimestamp;
      state.gameWin = true;
      state.gameOver = true;
      state.gameTime = finalTime;
    },
  },
});

export const gameStateActions = gameStateSlice.actions;
export const boardActions = boardSlice.actions;

export const gameStateReducer = gameStateSlice.reducer;
export const boardReducer = boardSlice.reducer;
