import { FaMedal } from "react-icons/fa";
import { IconContext } from "react-icons";

const HighScoreRow = ({ highscore: { playerName, time, rank } }) => {
  // medal colors
  const medalColors = {
    0: "#D6AF36", // gold
    1: "#A7A7AD", // silver
    2: "#A77044", // bronze
  };

  const rankFormatted = () => {
    return rank < 3 ? (
      <IconContext.Provider value={{ color: medalColors[rank], size: 22 }}>
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
      <div className="highscores-list-time">{(time / 1000).toFixed(2)}</div>
    </>
  );
};

export default HighScoreRow;
