import React from "react";

// icons
import { IconContext } from "react-icons";
import { FaMedal } from "react-icons/fa";

// medal colors
const medalColors: { [key: number]: string } = {
  0: "#D6AF36", // gold
  1: "#A7A7AD", // silver
  2: "#A77044", // bronze
};

const LeaderboardListHeaders = () => {
  return (
    <div className="leaderboard-list-headers">
      <div className="leaderboard-list-rank">Rank</div>
      <div className="leaderboard-list-name font-semibold">Name</div>
      <div className="leaderboard-list-goldmedal pt-1">
        <IconContext.Provider value={{ color: medalColors[0], size: "18" }}>
          <FaMedal />
        </IconContext.Provider>
      </div>
      <div className="leaderboard-list-silvermedal pt-1">
        <IconContext.Provider value={{ color: medalColors[1], size: "18" }}>
          <FaMedal />
        </IconContext.Provider>
      </div>
      <div className="leaderboard-list-bronzemedal pt-1">
        <IconContext.Provider value={{ color: medalColors[2], size: "18" }}>
          <FaMedal />
        </IconContext.Provider>
      </div>
      <div className="leaderboard-list-totalscore">Score</div>
    </div>
  );
};

export default LeaderboardListHeaders;
