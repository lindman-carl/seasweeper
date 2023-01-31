import React from "react";
import ReactTooltip from "react-tooltip";

// components
import IconBadge from "./IconBadge";
import IconCheckbox from "./IconCheckbox";
import Logo from "../../Logo";
import Timer from "./Timer";

// icons & animations
import { BiSquare } from "react-icons/bi";
import { FaBomb } from "react-icons/fa";
import { RiMapFill } from "react-icons/ri";
import { GiBroom, GiBuoy, GiCompass } from "react-icons/gi";
import { SiLighthouse } from "react-icons/si";

// redux
import { gameStateActions } from "../../../redux/gameStateSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";

const Hud = () => {
  const {
    numPlacedMarkers,
    gameOver,
    gameTime,
    gameStarted,
    gameWin,
    lighthouseMode,
    availableLighthouses,
    showGamemodeCarousel,
    markerMode,
  } = useAppSelector((state: RootState) => state.gameState);
  const { numBombs, numWaterTiles, numRevealedTiles } = useAppSelector(
    (state: RootState) => state.board
  );
  const dispatch = useAppDispatch();

  const { setShowGamemodeCarousel, setLighthouseMode, setMarkerMode } =
    gameStateActions;

  // event handlers
  const handleToggleGamemodeCarousel = () => {
    // toggles gamemode carousel show state
    dispatch(setShowGamemodeCarousel(!showGamemodeCarousel));
  };

  // eventhandler for clicking lighthouse mode button
  const handleToggleLighthouseMode = () => {
    // if the player has available lighthouses
    if (availableLighthouses > 0) {
      // toggle lighhouse mode
      // disable mark mode
      dispatch(setLighthouseMode(!lighthouseMode));
      dispatch(setMarkerMode(false));
    }
  };

  // eventhandler for clicking mark mode button
  const handleToggleMarkMode = () => {
    // toggle mark mode
    // disable lighthouse mode
    dispatch(setMarkerMode(!markerMode));
    dispatch(setLighthouseMode(false));
  };

  const doubleIcon = () => {
    return (
      <div className="flex justify-center items-center">
        <RiMapFill
          size={44}
          className={`absolute ${
            showGamemodeCarousel ? "text-red-600" : "text-sky-800"
          }`}
        />
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
        <IconCheckbox
          icon={doubleIcon()}
          status={showGamemodeCarousel}
          onClick={handleToggleGamemodeCarousel}
          tooltip={"Select game mode"}
          id="toggle-gamemode-carousel"
          ariaLabel={"Toggle gamemode carousel"}
        />
        <div className="flex flex-row flex-grow justify-evenly items-center">
          <IconBadge
            icon={<FaBomb size={22} className="mb-1" />}
            value={numBombs}
            tooltip={"Number of bombs in the sea"}
            id="num-bombs"
          />
          <IconBadge
            icon={<GiBuoy size={28} className="mb-1" />}
            value={numPlacedMarkers}
            tooltip={"Number of markers placed in the sea"}
            id="num-markers-placed"
          />
          <IconBadge
            icon={<BiSquare size={24} />}
            value={numWaterTiles - numRevealedTiles - numBombs}
            tooltip={"Number of sea tiles left to clear"}
            id="num-tiles-left"
          />
        </div>
        <div className="flex flex-row justify-end items-center gap-2">
          <IconCheckbox
            icon={<SiLighthouse size={28} />}
            status={lighthouseMode}
            value={availableLighthouses}
            onClick={handleToggleLighthouseMode}
            tooltip={"Toogle place lighthouse mode"}
            id={"toggle-lighthouse-mode"}
            ariaLabel={"Toggle lighthouse mode"}
          />
          <IconCheckbox
            icon={<GiBroom size={36} className="mr-1" />}
            alternateIcon={<GiBuoy size={36} />}
            status={markerMode}
            onClick={handleToggleMarkMode}
            tooltip={"Toggle between mark and sweep mode"}
            id={"toggle-mark-mode"}
            ariaLabel={"Toggle mark mode"}
          />
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
