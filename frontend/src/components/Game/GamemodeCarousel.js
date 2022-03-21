import React, { useState } from "react";
// icons
import {
  MdArrowForwardIos,
  MdArrowBackIos,
  MdOutlineClose,
} from "react-icons/md";

const GamemodeCarousel = ({ gamemodes, name, handleSelectGamemode }) => {
  const startIndex = gamemodes.findIndex((gamemode) => gamemode.name === name);
  const [currentIndex, setCurrentIndex] = useState(startIndex ? startIndex : 0);

  const handleCarouselClick = (inc) => {
    const newIndex = currentIndex + inc;

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
      <div className="carousel-header">{gamemodes[currentIndex].label}</div>
      <div className="carousel-card">
        <div
          className="carousel-button h-32"
          onClick={() => handleCarouselClick(-1)}
        >
          <MdArrowBackIos size={32} />
        </div>
        <div
          className="carousel-image"
          onClick={() => handleSelectGamemode(gamemodes[currentIndex].link)}
        >
          <img
            src={gamemodes[currentIndex].img}
            alt={gamemodes[currentIndex].label}
          />
        </div>
        <div className="carousel-button" onClick={() => handleCarouselClick(1)}>
          <MdArrowForwardIos size={32} />
        </div>
      </div>
    </div>
  );
};

export default GamemodeCarousel;
