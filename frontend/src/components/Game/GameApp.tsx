import React, { useRef } from "react";

// components
import Game from "./Game";
import GameText from "./GameText";
import HighscoresApp from "../Highscore";
import Logo from "../Logo";
import SignatureFooter from "../SignatureFooter";

// context
import { GameStateProvider } from "../../context/gameStateContext";

const GameApp = () => {
  // refs
  const highscoresRef = useRef<any>();

  const handleRefetchHighscores = () => {
    // calls highscoreApp refetch method
    highscoresRef.current.refetchHighscores();
  };

  const setHighscoresMapFilter = (name: string) => {
    // sets highscoreApp filter to name
    highscoresRef.current.setMapFilter(name);
  };

  // render
  return (
    <div className="game-app-container">
      <GameStateProvider>
        <Game
          handleRefetchHighscores={handleRefetchHighscores}
          setHighscoresMapFilter={setHighscoresMapFilter}
        />
        <div className="game-info-container">
          <Logo variant={"logo-large"} />

          <div className="lg:ml-3">
            <GameText />
            <HighscoresApp ref={highscoresRef} />
          </div>
          <SignatureFooter />
        </div>
      </GameStateProvider>
    </div>
  );
};

export default GameApp;
