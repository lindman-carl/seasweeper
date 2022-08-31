import React, { useState } from "react";

// types
import { Gamemode } from "../../types";

// components
import CarouselBoard from "./CarouselBoard";

// icons
import {
  MdArrowForwardIos,
  MdArrowBackIos,
  MdOutlineClose,
  MdRefresh,
} from "react-icons/md";

type Props = {
  name: string;
  handleSelectGamemode: (index: number) => void;
  handleToggleGamemodeCarousel: () => void;
  mappedGamemodes: Gamemode[];
  regenerateGamemode: (id: number) => void;
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

const GamemodeCarousel = ({
  name,
  handleSelectGamemode,
  mappedGamemodes,
  handleToggleGamemodeCarousel,
  regenerateGamemode,
}: Props) => {
  const sortedGamemodes = [...mappedGamemodes].sort((a, z) => a.id - z.id);
  const startIndex = sortedGamemodes.findIndex((gm) => gm.name === name);
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
      <RegenerateGamemodeButton
        onClick={() => regenerateGamemode(currentIndex)}
      />
      {/* header */}
      <div className="carousel-header">
        {sortedGamemodes[currentIndex].label}
      </div>
      {/* close button */}
      <button
        className="carousel-close-button"
        onClick={handleToggleGamemodeCarousel}
      >
        <MdOutlineClose size={24} />
      </button>
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
