import React from "react";

// game state context
const GameStateContext = React.createContext<
  | {
      state: any;
      dispatch: React.Dispatch<any>;
    }
  | undefined
>(undefined);

// game state reducer
const gameStateReducer = (state: any, action: any) => {
  switch (action.type) {
    case "setGameState":
      return {
        ...state,
        gameState: action.payload,
      };
    default:
      return state;
  }
};

// initial game state
const initailGamesState = {};

// game state context provider
const GameStateProvider = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(
    gameStateReducer,
    initailGamesState
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
