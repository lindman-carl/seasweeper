import { IconContext } from "react-icons";
import { BsFlagFill } from "react-icons/bs";
import { FaBomb } from "react-icons/fa";

const Tile = ({ tile, onClick, onHover }) => {
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
        className="w-full h-full flex justify-center items-center"
        onClick={onClick}
        onMouseEnter={onHover}
      >
        <div
          className={`w-16 h-16 m-1
            border-dashed border-2
            ${color}
            transition-all duration-75 ease`}
        >
          <div className="w-full h-full flex justify-center items-center text-black text-2xl font-bold">
            {tile.bomb ? (
              <IconContext.Provider value={{ size: "1.5em" }}>
                <FaBomb className="drop-shadow" />
              </IconContext.Provider>
            ) : (
              formatCount()
            )}
          </div>
        </div>
      </div>
    );
  } else {
    // hidden tile
    return (
      <div
        className="w-full h-full flex justify-center items-center"
        onClick={onClick}
        onMouseEnter={onHover}
      >
        <div
          className={`w-16 h-16 m-1
        border-dashed border-2 shadow-md 
        ${color}
        hover:border-4 hover:border-slate-500 hover:rounded-lg hover:shadow-lg 
        active:scale-90 active:rounded-xl active:shadow-sm
        cursor-pointer
        transition-all duration-100 ease`}
        >
          <div className="w-full h-full flex justify-center items-center text-red-500 ">
            {tile.flag && (
              <IconContext.Provider value={{ size: "1.5em" }}>
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
