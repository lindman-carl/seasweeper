import React from "react";

// types
import { Gamemode, TileType } from "../../types";

// components
import TileCarousel from "./TileCarousel";

type Props = {
  mappedGamemodes: Gamemode[];
  currentIndex: number;
};

// render game board in carousel format
const CarouselBoard = ({ mappedGamemodes, currentIndex }: Props) => {
  const renderBoard = (board: any) => {
    const rows = [];

    // map each row with tile objects
    for (let y = 0; y < board.length; y++) {
      const row = board
        .filter((tile: any) => tile.y === y)
        .sort((a: any, z: any) => a.x - z.x);

      const mappedRow = row.map((tile: TileType, idx: number) => (
        <TileCarousel key={idx} tile={tile} />
      ));
      rows.push(mappedRow);
    }

    // map each row to a board array
    const boardMapped = rows.map((row, idx) => (
      <div key={idx} className="flex flex-row justify-start items-start shrink">
        {row}
      </div>
    ));
    return boardMapped;
  };

  // render board by index
  const renderCurrentBoard = (currentIndex: number) => {
    const currentBoard = mappedGamemodes[currentIndex].board;

    return renderBoard(currentBoard);
  };

  // render board
  return (
    mappedGamemodes && (
      <div className="flex flex-col shadow-lg">
        {renderCurrentBoard(currentIndex)}
      </div>
    )
  );
};

export default CarouselBoard;
