import React from "react";

// components
import Logo from "../Logo";

type Props = {
  children: JSX.Element;
};

const GameInfo = ({ children }: Props) => {
  return (
    <div className="game-info-container">
      <Logo variant={"logo-large"} />

      <div className="lg:ml-3">
        <div className="game-text-container">
          Click to reveal tile. Flags are for slow players, try to mark the
          mines in your head. Place lighthouses on shoreline to safely reveal
          adjacent water tiles.
          <a
            className="game-text-link"
            href="https://minesweepergame.com/strategy.php"
            target="_blank"
            rel="noreferrer"
            data-tip="Show tutorial"
            data-for="checkboxInfo"
          >
            Learn more
          </a>
        </div>

        {children}
      </div>
    </div>
  );
};

export default GameInfo;
