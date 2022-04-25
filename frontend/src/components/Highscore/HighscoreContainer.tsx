import React from "react";

type Props = {
  children: any;
};

const HighScoresContainer = ({ children }: Props) => {
  return <div className="highscores-container">{children}</div>;
};

export default HighScoresContainer;
