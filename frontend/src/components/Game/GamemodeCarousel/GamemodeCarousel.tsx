import React, { useEffect, useState } from "react";

// components
import CarouselBoard from "./CarouselBoard";

// icons
import {
  MdArrowForwardIos,
  MdArrowBackIos,
  MdOutlineClose,
  MdRefresh,
} from "react-icons/md";

// redux
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { gameStateActions } from "../../../redux/gameStateSlice";
import { getGamemodeById } from "../../../utils/gameUtils";
import { RootState } from "../../../redux/store";
import { Gamemode } from "../../../types";

type Props = {
  handleSelectGamemode: (index: number) => void;
};

// local components
const RegenerateGamemodeButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="h-20 col-start-1 col-span-1 row-start-1 row-span-1 flex items-center justify-center hover:animate-spin-custom"
    onClick={onClick}
    id="carousel-regenerate-button"
  >
    <MdRefresh size={28} />
  </button>
);

const Header = ({ label }: { label: string }) => (
  <div className="carousel-header">{label}</div>
);

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button className="carousel-close-button" onClick={onClick}>
    <MdOutlineClose size={24} />
  </button>
);

const LeftButton = ({ onClick }: { onClick: () => void }) => (
  <div
    className="carousel-navigation-button 
            col-start-1 row-start-2"
    onClick={onClick}
    id="carousel-left-button"
  >
    <MdArrowBackIos size={32} />
  </div>
);
const RightButton = ({ onClick }: { onClick: () => void }) => (
  <div
    className="carousel-navigation-button 
            col-start-3 row-start-2"
    onClick={onClick}
    id="carousel-right-button"
  >
    <MdArrowForwardIos size={32} />
  </div>
);

const GamemodeCarousel = ({ handleSelectGamemode }: Props) => {
  const {
    gamemodes,
    showGamemodeCarousel,
    currentGamemode: { id: startIndex },
  } = useAppSelector((state: RootState) => state.gameState);
  const dispatch = useAppDispatch();

  const { setShowGamemodeCarousel, regenerateGamemodeBoard } = gameStateActions;

  // index state
  const [currentIndex, setCurrentIndex] = useState<number>(
    startIndex ? startIndex : -1
  );
  const [gamemodeToDisplay, setGamemodeToDisplay] = useState<Gamemode>(
    gamemodes[startIndex]
  );

  useEffect(() => {
    const newGamemode = getGamemodeById(gamemodes, currentIndex);
    setGamemodeToDisplay(newGamemode);
  }, [gamemodes, currentIndex]);

  const handleCarouselNavigationClick = (inc: number) => {
    // handles click right and left navigation buttons
    const newIndex = currentIndex + inc;

    // loops if index goes out of range
    if (newIndex < 0) {
      setCurrentIndex(gamemodes.length - 1);
    } else if (newIndex >= gamemodes.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(newIndex);
    }
  };

  const handleToggleGamemodeCarousel = () => {
    // toggles gamemode carousel show state
    dispatch(setShowGamemodeCarousel(!showGamemodeCarousel));
  };

  const handleRegenerateBoard = () => {
    dispatch(regenerateGamemodeBoard(currentIndex));
  };

  // check if it supposed to render
  if (!showGamemodeCarousel) return null;

  return (
    <div className="carousel-container">
      <RegenerateGamemodeButton onClick={handleRegenerateBoard} />
      <Header label={gamemodeToDisplay.label} />
      <CloseButton onClick={handleToggleGamemodeCarousel} />
      <LeftButton onClick={() => handleCarouselNavigationClick(-1)} />
      <CarouselBoard
        board={gamemodeToDisplay.board}
        onClick={() => handleSelectGamemode(currentIndex)}
      />
      <RightButton onClick={() => handleCarouselNavigationClick(1)} />
    </div>
  );
};

export default GamemodeCarousel;
