import React from "react";

const Tile = React.memo(({ tile }) => {
  const renderLand = () => (
    <div
      className="
            tile-carousel-base
            bg-green-300"
    ></div>
  );

  const renderWater = () => {
    return (
      <div
        className="
            tile-carousel-base
            bg-blue-300"
      ></div>
    );
  };

  // redering function
  const renderTile = () => {
    return (
      <div className="tile-carousel-container">
        {
          tile.type === 1
            ? renderLand() // if land
            : tile.type === 2 && renderWater() // if not revealed water
        }
      </div>
    );
  };

  // render

  return renderTile();
});

export default Tile;
