// components
import TileCarousel from "./TileCarousel";

// render game board in carousel format
const CarouselBoard = ({ mappedGamemodes, currentIndex }) => {
  const renderBoard = (board) => {
    const rows = [];

    // map each row with tile objects
    for (let y = 0; y < board.length; y++) {
      const row = board.filter((t) => t.y === y).sort((a, b) => a.x - b.x);
      const mappedRow = row.map((tile, idx) => (
        <TileCarousel key={idx} tile={tile} board={board} />
      ));
      rows.push(mappedRow);
    }

    // map each row to a board array
    const boardMapped = rows.map((row, idx) => (
      <div key={idx} className="flex flex-row justify-start items-start shrink">
        {row}
      </div>
    ));
    return boardMapped;
  };

  // render board by index
  const renderCurrentBoard = (currentIndex) => {
    const board = mappedGamemodes.find((gm) => gm.id === currentIndex).board;
    return renderBoard(board);
  };

  // render board
  return (
    mappedGamemodes && (
      <div className="flex flex-col shadow-lg">
        {renderCurrentBoard(currentIndex)}
      </div>
    )
  );
};

export default CarouselBoard;
