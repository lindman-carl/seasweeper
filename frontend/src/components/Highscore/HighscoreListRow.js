import { FaMedal } from "react-icons/fa";
import { IconContext } from "react-icons";

const HighScoreRow = ({ highscore: { playerName, time }, rank, size }) => {
  const colors = {
    0: "#D6AF36",
    1: "#A7A7AD",
    2: "#A77044",
  };

  const rankFormatted = () => {
    if (rank < 3) {
      return (
        <div className="">
          <IconContext.Provider value={{ color: colors[rank], size: 22 }}>
            <FaMedal />
          </IconContext.Provider>
        </div>
      );
    } else {
      return <div className="ml-1">{rank + 1}</div>;
    }
  };

  return (
    <>
      <div className={`w-4 ml-1 mr-8 text-${size} font-medium`}>
        {rankFormatted()}
      </div>
      <div className={`text-${size} grow font-medium`}>{playerName}</div>
      <div className={`w-16 text-${size} text-left font-medium`}>
        {(time / 1000).toFixed(2)}
      </div>
    </>
  );
};

export default HighScoreRow;
