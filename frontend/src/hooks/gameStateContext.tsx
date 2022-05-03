import React from "react";
import { GameState } from "../types";
import { gamemodes } from "../gamemodes";

export enum GameStateActionType {
  SET_SHOW_GAMEMODE_CAROUSEL = "SET_SHOW_GAMEMODE_CAROUSEL",
  SET_CURRENT_GAMEBOARD = "SET_CURRENT_GAMEBOARD",
  SET_CURRENT_GAMEMODE_INDEX = "SET_CURRENT_GAMEMODE_INDEX",
  SET_GAME_STARTED = "SET_GAME_STARTED",
  SET_GAME_OVER = "SET_GAME_OVER",
  SET_GAME_WIN = "SET_GAME_WIN",
  SET_GAME_TIME = "SET_GAME_TIME",
  SET_LIGHTHOUSE_MODE = "SET_LIGHTHOUSE_MODE",
  SET_AVAILABLE_LIGHTHOUSES = "SET_AVAILABLE_LIGHTHOUSES",
  SET_MARK_MODE = "SET_MARK_MODE",
  SET_NUM_MARKERS = "SET_NUM_MARKERS",
  SET_NUM_REVEALED = "SET_NUM_REVEALED",
  SET_IS_SENDING_HIGHSCORE = "SET_IS_SENDING_HIGHSCORE",
  SET_MAPPED_GAMEMODES = "SET_MAPPED_GAMEMODES",
  SET_CURRENT_GAMEMODE = "SET_CURRENT_GAMEMODE",
}

export type GameStateAction = {
  type: GameStateActionType;
  payload?: any;
};

// game state context
const GameStateContext = React.createContext<
  | {
      state: any;
      dispatch: React.Dispatch<any>;
    }
  | undefined
>(undefined);

// game state reducer
const gameStateReducer = (state: any, action: GameStateAction) => {
  switch (action.type) {
    case GameStateActionType.SET_SHOW_GAMEMODE_CAROUSEL:
      return {
        ...state,
        showGamemodeCarousel: action.payload,
      };
    case GameStateActionType.SET_CURRENT_GAMEBOARD:
      return {
        ...state,
        currentGameBoard: action.payload,
      };
    case GameStateActionType.SET_GAME_STARTED:
      return {
        ...state,
        gameStarted: action.payload,
      };
    case GameStateActionType.SET_GAME_OVER:
      return {
        ...state,
        gameOver: action.payload,
      };
    case GameStateActionType.SET_GAME_WIN:
      return {
        ...state,
        gameWin: action.payload,
      };
    case GameStateActionType.SET_GAME_TIME:
      return {
        ...state,
        gameTime: action.payload,
      };
    case GameStateActionType.SET_LIGHTHOUSE_MODE:
      return {
        ...state,
        lighthouseMode: action.payload,
      };
    case GameStateActionType.SET_AVAILABLE_LIGHTHOUSES:
      return {
        ...state,
        availableLighthouses: action.payload,
      };
    case GameStateActionType.SET_MARK_MODE:
      return {
        ...state,
        markMode: action.payload,
      };
    case GameStateActionType.SET_NUM_REVEALED:
      return {
        ...state,
        numRevealed: action.payload,
      };
    case GameStateActionType.SET_NUM_MARKERS:
      return {
        ...state,
        numMarkers: action.payload,
      };
    case GameStateActionType.SET_IS_SENDING_HIGHSCORE:
      return {
        ...state,
        isSendingHighscore: action.payload,
      };
    case GameStateActionType.SET_MAPPED_GAMEMODES:
      return {
        ...state,
        mappedGamemodes: action.payload,
      };
    case GameStateActionType.SET_CURRENT_GAMEMODE:
      return {
        ...state,
        currentGamemode: action.payload,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

// initial game state
const initialGamesState: GameState = {
  gamemodes: gamemodes,
  mappedGamemodes: undefined,
  currentGameBoard: gamemodes[0].board,
  currentGamemode: gamemodes[0],
  showGamemodeCarousel: false,
  gameStarted: false,
  gameOver: false,
  gameWin: false,
  gameTime: 0,
  lighthouseMode: false,
  availableLighthouses: gamemodes[0].nLighthouses,
  markMode: false,
  numMarkers: 0,
  numRevealed: 0,
  isSendingHighscore: false,
};

// game state context provider
const GameStateProvider = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(
    gameStateReducer,
    initialGamesState
  );

  const value = { state, dispatch };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

// game state hook
const useGameState = () => {
  const context = React.useContext(GameStateContext);

  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }

  return context;
};

export { useGameState, GameStateProvider };
