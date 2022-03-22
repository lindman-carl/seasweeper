// components
import Timer from "./Timer";
import IconCheckbox from "./IconCheckbox";
import Logo from "../Logo";

// icons & animations
import { BiSquare } from "react-icons/bi";
import { FaBomb } from "react-icons/fa";
import { GiBroom } from "react-icons/gi";
import { GiBuoy } from "react-icons/gi";
import { SiLighthouse } from "react-icons/si";
import IconBadge from "./IconBadge";
import ReactTooltip from "react-tooltip";

const Hud = ({
  nBombs,
  seaTiles,
  nRevealed,
  gameOver,
  gameTime,
  gameStarted,
  win,
  lighthouseMode,
  availableLighthouses,
  handleLighthouseMode,
  markMode,
  handleMarkMode,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl text-sky-900 font-bold h-10 mt-4">
        {gameStarted ? (
          !gameOver ? (
            <Timer time={gameTime} />
          ) : win ? (
            "You win!"
          ) : (
            "Game over!"
          )
        ) : (
          <div className="mb-3">
            <Logo size={"sm"} />
          </div>
        )}
      </div>

      <div
        className="w-full h-20 
            my-2 px-2 
            sm:px-20 
            flex flex-row items-center justify-between"
      >
        <div className="flex flex-col sm:flex-row mt-1 justify-center items-start ">
          <div className="sm:mr-1 ">
            <IconBadge
              icon={<FaBomb size={18} />}
              value={nBombs}
              tooltip={"Number of bombs remaining in the sea"}
            />
          </div>
          <div className="sm:ml-1 ">
            <IconBadge
              icon={<BiSquare size={20} />}
              value={seaTiles - nRevealed - nBombs}
              tooltip={"Number of tiles left to clear"}
            />
          </div>
        </div>
        <div className="w-64 flex flex-row justify-end items-center">
          <div className="mr-1">
            <IconCheckbox
              icon={<SiLighthouse size={28} />}
              status={lighthouseMode}
              value={availableLighthouses}
              onClick={handleLighthouseMode}
              tooltip={"Toogle place lighthouse mode"}
            />
          </div>
          <div className="ml-1">
            <IconCheckbox
              icon={<GiBroom size={36} className="mr-1" />}
              alternateIcon={<GiBuoy size={36} />}
              status={markMode}
              onClick={handleMarkMode}
              tooltip={"Toggle between mark and sweep mode"}
            />
          </div>
        </div>
        <ReactTooltip id="badgeInfo" type="info" effect="solid" />
        <ReactTooltip
          id="checkboxInfo"
          type="info"
          effect="solid"
          delayShow={600}
          place="top"
        />
      </div>
    </div>
  );
};

export default Hud;
