import React from "react";

// types
import { LeaderboardEntry } from "../../types";

type Props = {
  index: number;
  leaderboardEntry: LeaderboardEntry;
};

const LeaderboardListRow = ({
  index,
  leaderboardEntry: {
    playerName,
    goldMedals,
    silverMedals,
    bronzeMedals,
    medalScore,
  },
}: Props) => {
  return (
    <div className="leaderboard-list-row">
      <div className="leaderboard-list-rank">{index + 1}</div>
      <div className="leaderboard-list-name">{playerName}</div>
      <div className="leaderboard-list-goldmedal">{goldMedals || 0}</div>
      <div className="leaderboard-list-silvermedal">{silverMedals || 0}</div>
      <div className="leaderboard-list-bronzemedal">{bronzeMedals || 0}</div>
      <div className="leaderboard-list-totalscore">{medalScore}</div>
    </div>
  );
};

export default LeaderboardListRow;
