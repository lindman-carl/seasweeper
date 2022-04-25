import React from "react";

const HighscoreListHeaders = () => {
  return (
    <div className="highscores-list-headers">
      <div className="highscores-list-rank">Rank</div>
      <div className="highscores-list-name font-semibold">Name</div>
      <div className="text-right">Time (s)</div>
    </div>
  );
};

export default HighscoreListHeaders;
