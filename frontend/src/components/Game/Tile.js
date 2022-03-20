import { IconContext } from "react-icons";
import { BsFlagFill } from "react-icons/bs";
import { FaBomb } from "react-icons/fa";

const Tile = ({ tile, onClick }) => {
  let iconSize = "1.5em";
  let color = "bg-gray-300";

  if (tile.revealed) {
    color = "bg-white-100";
  } else {
    color = "bg-blue-300";
  }

  const formatCount = () => {
    if (tile.count > 0) {
      return tile.count;
    }
    return null;
  };

  // land
  if (tile.type === 1) {
    return (
      <div
        className={`w-full h-min p-0.5 sm:p-1 flex justify-center items-center`}
        onClick={onClick}
      >
        <div
          className={`
            w-7 h-7
            border-dashed border
            md:border-1
            shadow-md 
            bg-green-300
            sm:hover:border-2
            hover:border-slate-500 sm:hover:rounded-md sm:hover:shadow-lg 
            active:rounded-lg
            sm:active:scale-90 sm:active:shadow-sm
            cursor-pointer
            transition-all duration-100 ease`}
        ></div>
      </div>
    );
  }

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
            border-dashed border
            md:border-1
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
          // sm:w-8 sm:h-8
          // md:w-12 md:h-12
          // lg:w-16 lg:h-16
          className={`
            w-7 h-7
            border-dashed border
            md:border-1
            shadow-md 
            ${color}
            sm:hover:border-2 
            hover:border-slate-500 sm:hover:rounded-md sm:hover:shadow-lg 
            active:rounded-lg
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
