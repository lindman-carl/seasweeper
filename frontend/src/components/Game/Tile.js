import { IconContext } from "react-icons";
import { BsFlagFill } from "react-icons/bs";
import { FaBomb } from "react-icons/fa";

const Tile = ({ tile, onClick }) => {
  let iconSize = "1.5em";
  let color = "bg-gray-300";

  if (tile.revealed) {
    color = "bg-white-100";
  } else {
    color = "bg-gray-300";
  }

  const formatCount = () => {
    if (tile.count > 0) {
      return tile.count;
    }
    return null;
  };

  if (tile.revealed) {
    // revealed tile
    return (
      <div
        className={`w-full h-min p-0.5 sm:p-1 flex justify-center items-center`}
        onClick={onClick}
      >
        <div
          className={`
            w-7 h-7
            sm:w-8 sm:h-8
            md:w-12 md:h-12
            lg:w-16 lg:h-16
            border-dashed border
            md:border-2
            ${color}
            transition-all duration-75 ease`}
        >
          <div className="w-full h-full flex justify-center items-center text-black text-2xl font-bold">
            {tile.bomb ? (
              <IconContext.Provider value={{ size: iconSize }}>
                <FaBomb className="drop-shadow" />
              </IconContext.Provider>
            ) : (
              <div className="text-sm sm:text-lg md:text-2xl">
                {formatCount()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    // hidden tile
    return (
      <div
        className={`w-full h-min p-0.5 sm:p-1 flex justify-center items-center`}
        onClick={onClick}
      >
        <div
          className={`
            w-7 h-7
            sm:w-8 sm:h-8
            md:w-12 md:h-12
            lg:w-16 lg:h-16
            border-dashed border
            md:border-2
            shadow-md 
            ${color}
            sm:hover:border-4 
            hover:border-slate-500 sm:hover:rounded-lg sm:hover:shadow-lg 
            active:rounded-xl
            sm:active:scale-90 sm:active:shadow-sm
            cursor-pointer
            transition-all duration-100 ease`}
        >
          <div className="w-full h-full flex justify-center items-center text-red-500 ">
            {tile.flag && (
              <IconContext.Provider value={{ size: iconSize }}>
                <BsFlagFill className="drop-shadow" />
              </IconContext.Provider>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Tile;
