import React, { useState, useEffect } from "react";
// icons
import {
  MdArrowForwardIos,
  MdArrowBackIos,
  MdOutlineClose,
} from "react-icons/md";

import gameUtils from "./gameUtils";
import { generateValidMergedMap } from "./islandMapGenerator";

// components
import TileCarousel from "./TileCarousel";

const CarouselBoard = ({ mappedGamemodes, currentIndex }) => {
  const renderBoard = (board) => {
    const rows = [];
    for (let y = 0; y < board.length; y++) {
      // iterate y axis
      const row = board.filter((t) => t.y === y).sort((a, b) => a.x - b.x);
      const mappedRow = row.map((tile, idx) => (
        <TileCarousel key={idx} tile={tile} board={board} />
      ));
      rows.push(mappedRow);
    }

    const rowsMapped = rows.map((row, idx) => (
      <div key={idx} className="flex flex-row justify-start items-start shrink">
        {row}
      </div>
    ));
    return rowsMapped;
  };

  const renderCurrentBoard = (currentIndex) => {
    const board = mappedGamemodes.find((gm) => gm.id === currentIndex).board;
    return renderBoard(board);
  };

  return (
    mappedGamemodes && (
      <div className="flex flex-col">{renderCurrentBoard(currentIndex)}</div>
    )
  );
};

const GamemodeCarousel = ({
  gamemodes,
  name,
  handleSelectGamemode,
  mappedGamemodes,
}) => {
  const startIndex = gamemodes.findIndex((gamemode) => gamemode.name === name);
  const [currentIndex, setCurrentIndex] = useState(startIndex ? startIndex : 0);

  const [testBoard, setTestBoard] = useState(null);
  useEffect(() => {
    const generateBoard = async () => {
      const tempMap = await generateValidMergedMap(20, 20, 12, 4);
      const tempBoard = await gameUtils.populateGeneratedMap(32, tempMap);
      setTestBoard(tempBoard);
    };

    generateBoard();
  }, []);

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
          onClick={() => handleSelectGamemode(currentIndex)}
        >
          <CarouselBoard
            mappedGamemodes={mappedGamemodes}
            currentIndex={currentIndex}
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
