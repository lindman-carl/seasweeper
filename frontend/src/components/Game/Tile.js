import React from "react";
import { IconContext } from "react-icons";
// import { BsFlagFill } from "react-icons/bs";
import { FaBomb } from "react-icons/fa";
import { SiLighthouse } from "react-icons/si";
import { GiBuoy } from "react-icons/gi";

const Tile = ({ tile, onClick }) => {
  let iconSize = "1.5em";

  const formatCount = () => {
    if (tile.count > 0) {
      return tile.count;
    }
    return null;
  };

  const renderRevealed = () => {
    if (tile.lit) {
      return (
        <div
          className={`
        tile-base
        shadow-none
        bg-yellow-100
        `}
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
    } else {
      return (
        <div
          className={`
            tile-base
            shadow-none
            bg-sky-50
    `}
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
    }
  };

  const renderLand = () => (
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

  const renderWater = () => {
    const markedIcon = () => (
      <div className="tile-icon-container text-yellow-300 drop-shadow-lg animate-wiggle ">
        <IconContext.Provider value={{ size: "1.5em" }}>
          <div className="relative w-full h-full">
            <GiBuoy className=" scale-y-100 scale-x-50 rotate-3 absolute bottom-1.5 z-50 text-red-300 opacity-80" />
            <GiBuoy className=" scale-y-110 scale-x-75 absolute bottom-1.5 z-40 text-red-400 opacity-80 " />
            <GiBuoy className=" scale-y-110 scale-x-90 absolute bottom-1.5 z-20 text-red-500 opacity-80" />
            <GiBuoy className=" scale-y-125 scale-x-95 absolute bottom-1.5 z-30 text-sky-800 opacity-80" />
            <GiBuoy className=" scale-y-150 scale-x-105 absolute bottom-2 z-10 text-red-500 opacity-80" />
            <GiBuoy className=" scale-y-150 scale-x-125 absolute bottom-2 z-0 text-sky-800 opacity-" />
          </div>
        </IconContext.Provider>
      </div>
    );
    return (
      <div
        className="
            tile-base
            tile-clickable
            bg-blue-300"
      >
        {tile.marked && markedIcon()}
      </div>
    );
  };

  // redering function
  const renderTile = () => {
    return (
      <div className="tile-container" onClick={onClick}>
        {
          tile.type === 1
            ? renderLand() // if land
            : tile.type === 2 && tile.revealed // if water
            ? renderRevealed() // if revealed water
            : renderWater() // if not revealed water
        }
      </div>
    );
  };

  // render

  return renderTile();
};

export default Tile;
