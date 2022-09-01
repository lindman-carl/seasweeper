import { Board, Gamemode, GameState } from "../types";
import {
  depopulateBoard,
  generateBoard,
  generateBoardForSpecificGamemode,
  generateOpenSeaBoard,
  populateBombs,
} from "../utils/boardGeneration";
import {
  countRevealedTiles,
  getGamemodeById,
  hideAllTiles,
  revealAllTiles,
} from "../utils/gameUtils";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  SET_AVAILABLE_LIGHTHOUSES = "SET_AVAILABLE_LIGHTHOUSES",
  SET_BOARD = "SET_BOARD",
  SET_CURRENT_GAMEMODE = "SET_CURRENT_GAMEMODE",
  SET_GAME_OVER = "SET_GAME_OVER",
  SET_GAME_START_TIMESTAMP = "SET_GAME_START_TIMESTAMP",
  SET_GAME_STARTED = "SET_GAME_STARTED",
  SET_GAME_TIME = "SET_GAME_TIME",
  SET_GAME_WIN = "SET_GAME_WIN",
  SET_GAMEMODES = "SET_GAMEMODES",
  SET_INTERVAL_ID = "SET_INTERVAL_ID",
  SET_IS_SENDING_HIGHSCORE = "SET_IS_SENDING_HIGHSCORE",
  SET_LIGHTHOUSE_MODE = "SET_LIGHTHOUSE_MODE",
  SET_MARKER_MODE = "SET_MARKER_MODE",
  SET_NUM_PLACED_MARKERS = "SET_NUM_PLACED_MARKERS",
  SET_NUM_REVEALED_TILES = "SET_NUM_REVEALED_TILES",
  SET_NUM_WATER_TILES = "SET_NUM_WATER_TILES",
  SET_SHOW_GAMEMODE_CAROUSEL = "SET_SHOW_GAMEMODE_CAROUSEL",
  REGENERATE_BOARD = "REGENERATE_BOARD",
  REPOPULATE_BOARD = "REPOPULATE_BOARD",
  REVEAL_BOARD = "REVEAL_BOARD",
  GENERATE_NEW_BOARD = "GENERATE_NEW_BOARD",
  UPDATE_NUM_REVEALED_TILES = "UPDATE_NUM_REVEALED_TILES",
  RESET_GAME = "RESET_GAME",
  SELECT_GAMEMODE = "SELECT_GAMEMODE",
  START_GAME = "START_GAME",
  WIN_GAME = "WIN_GAME",
}

type GameStatePayload = {
  [Types.SET_BOARD]: {
    board: Board;
  };
  [Types.SET_CURRENT_GAMEMODE]: {
    currentGamemode: Gamemode;
  };
  [Types.SET_NUM_WATER_TILES]: {
    numWaterTiles: number;
  };
  [Types.SET_AVAILABLE_LIGHTHOUSES]: {
    availableLighthouses: number;
  };
  [Types.SET_GAMEMODES]: {
    gamemodes: Gamemode[];
  };
  [Types.SET_NUM_PLACED_MARKERS]: {
    numPlacedMarkers: number;
  };
  [Types.SET_NUM_REVEALED_TILES]: {
    numRevealedTiles: number;
  };
  [Types.SET_GAME_OVER]: {
    gameOver: boolean;
  };
  [Types.SET_GAME_STARTED]: {
    gameStarted: boolean;
  };
  [Types.SET_GAME_START_TIMESTAMP]: {
    gameStartTimestamp: number;
  };
  [Types.SET_GAME_WIN]: {
    gameWin: boolean;
  };
  [Types.SET_GAME_TIME]: {
    gameTime: number;
  };
  [Types.SET_LIGHTHOUSE_MODE]: {
    lighthouseMode: boolean;
  };
  [Types.SET_MARKER_MODE]: {
    markerMode: boolean;
  };
  [Types.SET_SHOW_GAMEMODE_CAROUSEL]: {
    showGamemodeCarousel: boolean;
  };
  [Types.SET_INTERVAL_ID]: {
    intervalId: unknown;
  };
  [Types.SET_IS_SENDING_HIGHSCORE]: {
    isSendingHighscore: boolean;
  };
  [Types.REGENERATE_BOARD]: {
    gamemodeId: number;
  };
  [Types.REPOPULATE_BOARD]: {
    board: Board;
    gamemode: Gamemode;
  };
  [Types.REVEAL_BOARD]: {
    board: Board;
  };
  [Types.GENERATE_NEW_BOARD]: {
    gamemode: Gamemode;
  };
  [Types.UPDATE_NUM_REVEALED_TILES]: {
    board: Board;
  };
  [Types.RESET_GAME]: {};
  [Types.SELECT_GAMEMODE]: {
    id: number;
  };
  [Types.START_GAME]: {
    intervalId: any;
    gameStartTimestamp: number;
  };
  [Types.WIN_GAME]: {};
};

export type GameStateActions =
  ActionMap<GameStatePayload>[keyof ActionMap<GameStatePayload>];

export const gameStateReducer = (
  state: GameState,
  action: GameStateActions
) => {
  switch (action.type) {
    case Types.SET_BOARD:
      return {
        ...state,
        board: action.payload.board,
      };
    case Types.SET_CURRENT_GAMEMODE:
      return {
        ...state,
        currentGamemode: action.payload.currentGamemode,
      };
    case Types.SET_NUM_WATER_TILES:
      return {
        ...state,
        board: { ...state.board, numWaterTiles: action.payload.numWaterTiles },
      };
    case Types.SET_AVAILABLE_LIGHTHOUSES:
      return {
        ...state,
        availableLighthouses: action.payload.availableLighthouses,
      };
    case Types.SET_GAMEMODES:
      return {
        ...state,
        gamemodes: action.payload.gamemodes,
      };
    case Types.SET_NUM_PLACED_MARKERS:
      return {
        ...state,
        numPlacedMarkers: action.payload.numPlacedMarkers,
      };
    case Types.SET_NUM_REVEALED_TILES:
      return {
        ...state,
        board: {
          ...state.board,
          numRevealedTiles: action.payload.numRevealedTiles,
        },
      };
    case Types.SET_GAME_STARTED:
      return {
        ...state,
        gameStarted: action.payload.gameStarted,
      };
    case Types.SET_GAME_OVER:
      return {
        ...state,
        gameOver: action.payload.gameOver,
      };
    case Types.SET_GAME_WIN:
      return {
        ...state,
        gameWin: action.payload.gameWin,
      };
    case Types.SET_LIGHTHOUSE_MODE:
      return {
        ...state,
        lighthouseMode: action.payload.lighthouseMode,
      };
    case Types.SET_MARKER_MODE:
      return {
        ...state,
        markerMode: action.payload.markerMode,
      };
    case Types.SET_SHOW_GAMEMODE_CAROUSEL:
      return {
        ...state,
        showGamemodeCarousel: action.payload.showGamemodeCarousel,
      };
    case Types.SET_GAME_TIME:
      return {
        ...state,
        gameTime: action.payload.gameTime,
      };
    case Types.SET_GAME_START_TIMESTAMP:
      return {
        ...state,
        gameStartTimestamp: action.payload.gameStartTimestamp,
      };
    case Types.SET_INTERVAL_ID:
      return {
        ...state,
        intervalId: action.payload.intervalId,
      };
    case Types.SET_IS_SENDING_HIGHSCORE:
      return {
        ...state,
        isSendingHighscore: action.payload.isSendingHighscore,
      };
    case Types.REGENERATE_BOARD:
      const updatedGamemodes = generateBoardForSpecificGamemode(
        state.gamemodes,
        action.payload.gamemodeId
      );
      return {
        ...state,
        gamemodes: updatedGamemodes,
      };
    case Types.REPOPULATE_BOARD:
      if (action.payload.gamemode.nIslands === 0) {
        // open sea board
        // just create a new one
        // also this will never happen as the retry button is disabled
        const { width, height, numBombs } = action.payload.gamemode;
        const blankBoard = generateOpenSeaBoard(width, height, numBombs);

        return {
          ...state,
          board: blankBoard,
        };
      }
      // remove all bombs from board
      const depopulatedBoard = depopulateBoard(action.payload.board);
      // generate new bombs to board
      const repopulatedBoard = populateBombs(depopulatedBoard);
      // hide/unreveal all tiles
      const finalBoard = hideAllTiles(repopulatedBoard);

      return {
        ...state,
        board: finalBoard,
      };
    case Types.REVEAL_BOARD:
      const revealedBoard = revealAllTiles(action.payload.board);
      return {
        ...state,
        board: revealedBoard,
      };
    case Types.GENERATE_NEW_BOARD:
      const newBoard = generateBoard(action.payload.gamemode);

      return {
        ...state,
        board: newBoard,
      };
    case Types.UPDATE_NUM_REVEALED_TILES:
      const numRevealedTiles = countRevealedTiles(action.payload.board);
      return {
        ...state,
        board: { ...state.board, numRevealedTiles },
      };
    case Types.RESET_GAME:
      return {
        ...state,
        gameStarted: false,
        gameOver: false,
        gameWin: false,
        gameTime: 0,
        numPlacedMarkers: 0,
        availableLighthouses: state.currentGamemode.nLighthouses,
      };
    case Types.SELECT_GAMEMODE:
      const newCurrentGamemode = getGamemodeById(
        state.gamemodes,
        action.payload.id
      );
      const newGamemodes = generateBoardForSpecificGamemode(
        state.gamemodes,
        action.payload.id
      );

      return {
        ...state,
        currentGamemode: newCurrentGamemode,
        gamemodes: newGamemodes,
        board: newCurrentGamemode.board,
        showGamemodeCarousel: false,
      };
    case Types.START_GAME:
      return {
        ...state,
        board: { ...state.board, numRevealedTiles: 0 },
        gameStarted: true,
        intervalId: action.payload.intervalId,
        gameStartTimestamp: action.payload.gameStartTimestamp,
      };
    case Types.WIN_GAME:
      // clear timer
      clearInterval(state.intervalId);
      return {
        ...state,
        gameWin: true,
        gameOver: true,
        gameTime: Date.now() - state.gameStartTimestamp,
      };
    default:
      return state;
  }
};
