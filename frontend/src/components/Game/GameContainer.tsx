import React, { ReactNode } from "react";

type GameContainerProps = {
  children: ReactNode;
};

const GameContainer = ({ children }: GameContainerProps) => {
  return <div className="game-container">{children}</div>;
};

export default GameContainer;
