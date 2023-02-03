import React, { useRef } from "react";
import { Provider } from "react-redux";

// components
import Game from "./Game";
import GameText from "./GameText";
import HighscoresApp from "../Highscore";
import Logo from "../Logo";
import SignatureFooter from "../SignatureFooter";

// state management
import { store } from "../../redux/store";

const GameApp = () => {
  // refs
  const highscoresRef = useRef<any>();

  const handleRefetchHighscores = () => {
    // calls highscoreApp refetch method
    highscoresRef.current.refetchHighscores();
  };

  // render
  return (
    <div className="game-app-container">
      <Provider store={store}>
        <Game handleRefetchHighscores={handleRefetchHighscores} />
        <div className="game-info-container">
          <Logo variant={"logo-large"} />

          <div className="lg:ml-3">
            <GameText />
            <HighscoresApp ref={highscoresRef} />
          </div>
          <SignatureFooter />
        </div>
      </Provider>
    </div>
  );
};

export default GameApp;
