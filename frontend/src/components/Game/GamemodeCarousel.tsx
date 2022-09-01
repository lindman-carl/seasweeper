import React, { useState } from "react";

// components
import CarouselBoard from "./CarouselBoard";

// icons
import {
  MdArrowForwardIos,
  MdArrowBackIos,
  MdOutlineClose,
  MdRefresh,
} from "react-icons/md";
import { useGameState } from "../../context/gameStateContext";
import { Types } from "../../context/gameStateReducer";

type Props = {
  handleSelectGamemode: (index: number) => void;
};

// local components
const RegenerateGamemodeButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="h-20 col-start-1 col-span-1 row-start-1 row-span-1 flex items-center justify-center hover:animate-spin-custom"
    onClick={onClick}
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
  >
    <MdArrowBackIos size={32} />
  </div>
);
const RightButton = ({ onClick }: { onClick: () => void }) => (
  <div
    className="carousel-navigation-button 
            col-start-3 row-start-2"
    onClick={onClick}
  >
    <MdArrowForwardIos size={32} />
  </div>
);

const GamemodeCarousel = ({ handleSelectGamemode }: Props) => {
  const {
    state: {
      gamemodes,
      showGamemodeCarousel,
      currentGamemode: { id: startIndex },
    },
    dispatch,
  } = useGameState();

  // index state
  const [currentIndex, setCurrentIndex] = useState<number>(
    startIndex ? startIndex : 0
  );

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
    dispatch({
      type: Types.SET_SHOW_GAMEMODE_CAROUSEL,
      payload: { showGamemodeCarousel: !showGamemodeCarousel },
    });
  };

  const handleRegenerateBoard = () => {
    // regenerate current board
    dispatch({
      type: Types.REGENERATE_BOARD,
      payload: {
        gamemodeId: currentIndex,
      },
    });
  };

  const gamemodeToDisplay = gamemodes.sort((a, z) => a.id - z.id)[currentIndex];

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
