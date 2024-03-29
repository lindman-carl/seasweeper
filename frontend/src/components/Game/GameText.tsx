import React from "react";

// icons
import { MdOpenInNew } from "react-icons/md";

const GameText = () => (
  <div className="game-text-container">
    Click on a blue (sea tile) tile to reveal it. Flags are for slow players,
    try to mark the mines in your head. Place lighthouses on green tiles (land
    tiles) to safely reveal adjacent sea tiles.
    <a
      className="game-text-link"
      href="https://minesweepergame.com/strategy.php"
      target="_blank"
      rel="noreferrer"
      data-tip="Show tutorial"
      data-for="checkboxInfo"
    >
      How to play
      <MdOpenInNew />
    </a>
  </div>
);

export default GameText;
