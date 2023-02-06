import React from "react";

// types
import { LeaderboardEntry } from "../../types";

// icons
import { IconContext } from "react-icons";
import { GiTrophy } from "react-icons/gi";

type Props = {
  leaderboardEntry: LeaderboardEntry;
};

const LeaderboardChampion = ({ leaderboardEntry: { playerName } }: Props) => {
  return (
    <div className="leaderboard-champion">
      <IconContext.Provider value={{ color: "#D6AF36", size: "38" }}>
        <GiTrophy />
        <div className="leaderboard-champion-name">{playerName}</div>
        <GiTrophy />
      </IconContext.Provider>
    </div>
  );
};

export default LeaderboardChampion;
