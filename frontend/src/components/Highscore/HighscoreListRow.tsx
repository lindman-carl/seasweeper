import React from "react";

// types
import { HighscoreEntry } from "../../types";

// icons
import { IconContext } from "react-icons";
import { FaMedal } from "react-icons/fa";

type Props = {
  highscore: HighscoreEntry;
};

const HighScoreRow = ({ highscore: { playerName, time, rank } }: Props) => {
  // medal colors
  const medalColors: { [key: number]: string } = {
    0: "#D6AF36", // gold
    1: "#A7A7AD", // silver
    2: "#A77044", // bronze
  };

  const rankFormatted = () => {
    // display rank as a medal for placing 1-3
    // rank is 0-indexed, so we add 1 to it
    return rank < 3 ? (
      <IconContext.Provider value={{ color: medalColors[rank], size: "22" }}>
        <FaMedal />
      </IconContext.Provider>
    ) : (
      rank + 1
    );
  };

  return (
    <>
      <div className="highscores-list-rank">{rankFormatted()}</div>
      <div className="highscores-list-name">{playerName}</div>
      <div className="highscores-list-time">{(time / 1000).toPrecision()}</div>
    </>
  );
};

export default HighScoreRow;
