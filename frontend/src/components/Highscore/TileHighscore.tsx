import React from "react";

// types
import { TileType } from "../../types";

type Props = {
  tile: TileType;
};

const Tile = ({ tile }: Props) => {
  const renderTile = () => {
    // if land green, else blue
    const tileColor = tile.type === 1 ? "bg-green-300" : "bg-blue-300";
    const className = `tile-highscore-base ${tileColor}`;

    return <div className={className}></div>;
  };

  // redering function
  return (
    <div className="tile-highscore-container" id={`tile-highscore-${tile.id}`}>
      {renderTile()}
    </div>
  );
};

export default Tile;
