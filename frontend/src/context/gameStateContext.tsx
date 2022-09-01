import React, {
  createContext,
  ReactNode,
  useContext,
  Dispatch,
  useReducer,
} from "react";
import { GameState } from "../types";

import { gamemodes, getBlankBoard } from "../utils/gameUtils";
import { GameStateActions, gameStateReducer } from "./gameStateReducer";

export const initialGameState: GameState = {
  name: gamemodes[0].name,
  board: getBlankBoard(),
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

const GameStateContext = createContext<{
  state: GameState;
  dispatch: Dispatch<GameStateActions>;
}>({ state: initialGameState, dispatch: () => null });

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameStateReducer, initialGameState);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);

  if (!context) {
    throw Error("GameState Context must be use within the GameStateProvider");
  }

  return context;
};
