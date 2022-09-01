import React from "react";
import ReactTooltip from "react-tooltip";

// components
import IconBadge from "./IconBadge";
import IconCheckbox from "./IconCheckbox";
import Logo from "../Logo";
import Timer from "./Timer";

// icons & animations
import { BiSquare } from "react-icons/bi";
import { FaBomb } from "react-icons/fa";
import { RiMapFill } from "react-icons/ri";
import { GiBroom, GiBuoy, GiCompass } from "react-icons/gi";
import { SiLighthouse } from "react-icons/si";
import { useGameState } from "../../context/gameStateContext";
import { Types } from "../../context/gameStateReducer";

const Hud = () => {
  const {
    state: {
      board: { numBombs, numWaterTiles, numRevealedTiles },
      numPlacedMarkers,
      gameOver,
      gameTime,
      gameStarted,
      gameWin,
      lighthouseMode,
      availableLighthouses,
      showGamemodeCarousel,
      markerMode,
    },
    dispatch,
  } = useGameState();

  // event handlers
  const handleToggleGamemodeCarousel = () => {
    // toggles gamemode carousel show state
    dispatch({
      type: Types.SET_SHOW_GAMEMODE_CAROUSEL,
      payload: { showGamemodeCarousel: !showGamemodeCarousel },
    });
  };

  // eventhandler for clicking lighthouse mode button
  const handleToggleLighthouseMode = () => {
    // if the player has available lighthouses
    if (availableLighthouses > 0) {
      // toggle lighhouse mode
      dispatch({
        type: Types.SET_LIGHTHOUSE_MODE,
        payload: { lighthouseMode: !lighthouseMode },
      });
      // disable mark mode
      dispatch({
        type: Types.SET_MARKER_MODE,
        payload: { markerMode: false },
      });
    }
  };

  // eventhandler for clicking mark mode button
  const handleToggleMarkMode = () => {
    // toggle mark mode
    dispatch({
      type: Types.SET_MARKER_MODE,
      payload: { markerMode: !markerMode },
    });
    // disable lighthouse mode
    dispatch({
      type: Types.SET_LIGHTHOUSE_MODE,
      payload: { lighthouseMode: false },
    });
  };

  const doubleIcon = () => {
    return (
      <div className="flex justify-center items-center">
        <RiMapFill size={44} className="absolute text-sky-800" />
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
            ) : gameWin ? (
              <div className="pt-2">You win!</div>
            ) : (
              <div className="pt-2">Game over!</div>
            )
          ) : (
            <div className="mb-3">
              <Logo variant={"logo-small"} />
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
            onClick={handleToggleGamemodeCarousel}
            tooltip={"Select game mode"}
          />
        </div>
        <div className="w-full flex flex-row mt-1 mx-1 justify-between items-center">
          <div className="mr-1 grow">
            <IconBadge
              icon={<FaBomb size={22} className="mb-1" />}
              value={numBombs}
              tooltip={"Number of bombs remaining in the sea"}
            />
          </div>
          <div className="grow">
            <IconBadge
              icon={<GiBuoy size={28} className="mb-1" />}
              value={numPlacedMarkers}
              tooltip={"Number of markers placed in the sea"}
            />
          </div>
          <div className="ml-1 grow">
            <IconBadge
              icon={<BiSquare size={24} />}
              value={numWaterTiles - numRevealedTiles - numBombs}
              tooltip={"Number of sea tiles left to clear"}
            />
          </div>
        </div>
        <div className="w-64 flex flex-row justify-end items-center">
          <div className="mr-1">
            <IconCheckbox
              icon={<SiLighthouse size={28} />}
              status={lighthouseMode}
              value={availableLighthouses}
              onClick={handleToggleLighthouseMode}
              tooltip={"Toogle place lighthouse mode"}
            />
          </div>
          <div className="ml-1">
            <IconCheckbox
              icon={<GiBroom size={36} className="mr-1" />}
              alternateIcon={<GiBuoy size={36} />}
              status={markerMode}
              onClick={handleToggleMarkMode}
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
