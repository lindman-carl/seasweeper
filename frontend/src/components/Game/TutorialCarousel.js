import React, { useState } from "react";

// icons
import {
  MdArrowForwardIos,
  MdArrowBackIos,
  MdOutlineClose,
} from "react-icons/md";

// components
import CarouselBoard from "./CarouselBoard";

const TutorialCarousel = ({
  gamemodes,
  name,
  handleSelectGamemode,
  mappedGamemodes,
  handleToggleGamemodeCarousel,
}) => {
  const startIndex = gamemodes.findIndex((gm) => gm.name === name);
  const [currentIndex, setCurrentIndex] = useState(startIndex ? startIndex : 0);

  const handleCarouselNavigationClick = (inc) => {
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

  return (
    <div className="carousel-container">
      {/* header */}
      <div className="carousel-header ">
        {mappedGamemodes[currentIndex].label}
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
          mappedGamemodes={mappedGamemodes}
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

export default TutorialCarousel;
