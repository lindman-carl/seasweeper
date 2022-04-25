import React from "react";

// types
import { TileType } from "../../types";

type Props = {
  tile: any | TileType;
};

const Tile = React.memo(({ tile }: Props) => {
  const renderTile = () => {
    // if land green, else blue
    const tileColor = tile.type === 1 ? "bg-green-300" : "bg-blue-300";
    const className = `tile-carousel-base ${tileColor}`;

    return <div className={className}></div>;
  };

  // redering function
  return <div className="tile-carousel-container">{renderTile()}</div>;
});

export default Tile;
