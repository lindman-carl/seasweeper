import React from "react";

// types
import { Board } from "../../types";

// components
import BoardComponent from "./BoardComponent";

type Props = {
  board: Board;
  onClick: () => void;
};

// render game board in carousel format
const CarouselBoard = ({ board, onClick }: Props) => {
  // render board
  return (
    <div className="carousel-card flex flex-col" onClick={onClick}>
      <BoardComponent board={board} carousel={true} />
    </div>
  );
};

export default CarouselBoard;
