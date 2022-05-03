import React, { useState } from "react";

// components
import CarouselBoard from "./CarouselBoard";

// hooks
import { useGameState } from "../../hooks/gameStateContext";

// icons
import {
  MdArrowForwardIos,
  MdArrowBackIos,
  MdOutlineClose,
} from "react-icons/md";

type Props = {
  name: string;
  handleSelectGamemode: (index: number) => void;
  handleToggleGamemodeCarousel: () => void;
};

const GamemodeCarousel = ({
  name,
  handleSelectGamemode,
  handleToggleGamemodeCarousel,
}: Props) => {
  // state
  const { state } = useGameState();

  const sortedGamemodes = [...state.mappedGamemodes].sort(
    (a, z) => a.id - z.id
  );
  const startIndex = sortedGamemodes.findIndex((gm) => gm.name === name);

  // local state
  const [currentIndex, setCurrentIndex] = useState(startIndex ? startIndex : 0);

  const handleCarouselNavigationClick = (inc: number) => {
    // handles click right and left navigation buttons
    const newIndex = currentIndex + inc;

    // loops if index goes out of range
    if (newIndex < 0) {
      setCurrentIndex(sortedGamemodes.length - 1);
    } else if (newIndex >= sortedGamemodes.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="carousel-container">
      {/* header */}
      <div className="carousel-header ">
        {sortedGamemodes[currentIndex].label}
      </div>
      {/* close button */}
      <div
        className="carousel-close-button"
        onClick={handleToggleGamemodeCarousel}
      >
        <MdOutlineClose size={20} />
      </div>
      {/* left button */}
      <div
        className="carousel-navigation-button 
                  col-start-1 row-start-2"
        onClick={() => handleCarouselNavigationClick(-1)}
      >
        <MdArrowBackIos size={32} />
      </div>
      {/* carousel main element */}
      <div
        className="carousel-card"
        onClick={() => handleSelectGamemode(currentIndex)}
      >
        <CarouselBoard
          mappedGamemodes={sortedGamemodes}
          currentIndex={currentIndex}
        />
      </div>
      {/* right button */}
      <div
        className="carousel-navigation-button 
                  col-start-3 row-start-2"
        onClick={() => handleCarouselNavigationClick(1)}
      >
        <MdArrowForwardIos size={32} />
      </div>
    </div>
  );
};

export default GamemodeCarousel;
