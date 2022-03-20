import React from "react";
import { IconContext } from "react-icons";
// import { BsFlagFill } from "react-icons/bs";
import { FaBomb } from "react-icons/fa";
import { SiLighthouse } from "react-icons/si";

const Tile = React.memo(({ tile, onClick }) => {
  let iconSize = "1.5em";

  const formatCount = () => {
    if (tile.count > 0) {
      return tile.count;
    }
    return null;
  };

  const formatRevealed = () => (
    <div
      className={`
    tile-base
    shadow-none
    ${tile.lit ? "bg-yellow-100" : "bg-sky-50"}`}
    >
      <div className="tile-icon-container text-black text-2xl font-bold">
        {tile.bomb ? (
          <IconContext.Provider value={{ size: iconSize }}>
            <FaBomb className="drop-shadow" />
          </IconContext.Provider>
        ) : (
          <div className="text-lg font-semibold ">{formatCount()}</div>
        )}
      </div>
    </div>
  );

  const formatLand = () => (
    <div
      className="
            tile-base
            tile-clickable
            bg-green-300"
    >
      <div className="tile-icon-container text-red-500 ">
        {tile.lighthouse && (
          <IconContext.Provider value={{ size: iconSize }}>
            <SiLighthouse className="drop-shadow" />
          </IconContext.Provider>
        )}
      </div>
    </div>
  );

  const formatTile = () => {
    if (tile.type === 1) {
      return (
        <div className="tile-container" onClick={onClick}>
          {formatLand()}
        </div>
      );
    } else if (tile.type === 2) {
      if (tile.revealed) {
        // revealed tile
        return (
          <div className="tile-container" onClick={onClick}>
            {formatRevealed()}
          </div>
        );
      } else {
        // hidden tile
        return (
          <div className="tile-container" onClick={onClick}>
            <div
              className="
                tile-base
                tile-clickable
                bg-blue-300"
            ></div>
          </div>
        );
      }
    }
  };

  // render

  return formatTile();
});

export default Tile;
