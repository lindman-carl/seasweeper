import React from "react";

// types
import { Board, TileType } from "../../types";

// components
import Tile from "./Tile";
import TileCarousel from "./TileCarousel";

type BoardProps = {
  board: Board;
  handleClickTile?: (tile: TileType) => void;
  carousel?: boolean;
};

const BoardComponent = ({
  board,
  handleClickTile = () => {},
  carousel = false,
}: BoardProps) => {
  // render board with Tile objects
  const rows = [];
  for (let y = 0; y < board.height; y++) {
    // iterate y axis
    const row = board.tiles.filter((t) => t.y === y).sort((a, b) => a.x - b.x);
    const mappedRow = row.map((tile, idx) => {
      if (carousel) {
        return <TileCarousel key={idx} tile={tile} />;
      } else {
        return (
          <Tile key={idx} tile={tile} onClick={() => handleClickTile(tile)} />
        );
      }
    });
    rows.push(mappedRow);
  }

  const rowsMapped = rows.map((row, idx) => (
    <div key={idx} className="flex flex-row justify-start items-start shrink">
      {row}
    </div>
  ));

  return <div className="flex flex-col ">{rowsMapped}</div>;
};

export default BoardComponent;
