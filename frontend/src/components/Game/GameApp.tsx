import React, { useRef, useState } from "react";
import { Provider } from "react-redux";

// components
import Game from "./Game";
import GameText from "./GameText";
import HighscoresApp from "../Highscore";
import Logo from "../Logo";
import SignatureFooter from "../SignatureFooter";
import UpdateModal from "../UpdateModal";

// state management
import { store } from "../../redux/store";

const GameApp = () => {
  // refs
  const highscoresRef = useRef<any>();

  // state
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(
    window.localStorage.getItem("dismissedUpdateModal") === null
  );

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    window.localStorage.setItem("dismissedUpdateModal", "true");
  };

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
      {showUpdateModal ? <UpdateModal onClose={closeUpdateModal} /> : null}
    </div>
  );
};

export default GameApp;
