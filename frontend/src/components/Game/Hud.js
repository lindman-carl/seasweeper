// components
import Timer from "./Timer";
import IconCheckbox from "./IconCheckbox";
import Logo from "../Logo";

// icons & animations
import { BiSquare } from "react-icons/bi";
import { BsMap } from "react-icons/bs";
import { FaBomb, FaMap } from "react-icons/fa";
import { RiMapFill } from "react-icons/ri";
import { ImEarth } from "react-icons/im";
import { GiBroom, GiBuoy, GiCompass, GiTreasureMap } from "react-icons/gi";
import { SiLighthouse } from "react-icons/si";
import IconBadge from "./IconBadge";
import ReactTooltip from "react-tooltip";
import { IconContext } from "react-icons";

const Hud = ({
  nBombs,
  nMarkers,
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
  showGamemodeCarousel,
  handleShowGamemodeCarousel,
}) => {
  const doubleIcon = () => {
    return (
      <div className="flex justify-center items-center">
        <RiMapFill size={44} className="absolute text-sky-700" />
        {/* <ImEarth size={22} className="absolute text-white" /> */}
        <GiCompass size={26} className="absolute  text-white" />
      </div>
    );
  };
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-row items-center justify-around">
        <div className="text-3xl text-sky-900 font-bold h-10 mt-2">
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
      </div>

      <div
        className="w-full h-20 
            my-2 px-2
            sm:px-20 
            flex flex-row items-center justify-between "
      >
        <div className="">
          <IconCheckbox
            icon={doubleIcon()}
            status={showGamemodeCarousel}
            onClick={handleShowGamemodeCarousel}
            tooltip={"Select game mode"}
          />
        </div>
        <div className="w-full flex flex-row mt-1 mx-1 justify-between items-center">
          <div className="mr-1 grow">
            <IconBadge
              icon={<FaBomb size={22} className="mb-1" />}
              value={nBombs}
              tooltip={"Number of bombs remaining in the sea"}
            />
          </div>
          <div className="grow">
            <IconBadge
              icon={<GiBuoy size={28} className="mb-1" />}
              value={nMarkers}
              tooltip={"Number of markers placed in the sea"}
            />
          </div>
          <div className="ml-1 grow">
            <IconBadge
              icon={<BiSquare size={24} />}
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
