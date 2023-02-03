import React from "react";

// types
import { Board } from "../../types";
import BoardComponent from "../Game/BoardComponent";

type Props = {
  board: Board;
};

const HighscoreBoard = ({ board }: Props) => {
  return (
    <div className="mb-4">
      <BoardComponent board={board} daily={true} />
    </div>
  );
};

export default HighscoreBoard;
