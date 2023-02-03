import React from "react";
import { handleClickTile } from "../../logic/handleClickTile";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

// types
import { Board, Gamemode } from "../../types";

// components
import Tile from "./Tile";
import TileCarousel from "./GamemodeCarousel/TileCarousel";
import TileHighscore from "../Highscore/TileHighscore";

type BoardProps = {
  board: Board;
  carousel?: boolean;
  daily?: boolean;
  handleRetryGame?: (board: Board, gamemode: Gamemode) => void;
};

const BoardComponent = ({
  carousel = false,
  daily = false,
  handleRetryGame = () => {},
  board,
}: BoardProps) => {
  const gameState = useAppSelector((state: RootState) => state.gameState);
  const dispatch = useAppDispatch();

  // render board with Tile objects
  const rows = [];
  for (let y = 0; y < board.height; y++) {
    // iterate y axis
    const row = board.tiles.filter((t) => t.y === y).sort((a, b) => a.x - b.x);
    const mappedRow = row.map((tile, idx) => {
      if (carousel) {
        return <TileCarousel key={idx} tile={tile} />;
      } else if (daily) {
        return <TileHighscore key={idx} tile={tile} />;
      } else {
        return (
          <Tile
            key={idx}
            tile={tile}
            onClick={() =>
              handleClickTile(tile, gameState, board, dispatch, handleRetryGame)
            }
          />
        );
      }
    });
    rows.push(mappedRow);
  }

  const rowsMapped = rows.map((row, idx) => (
    <div key={idx} className="flex flex-row justify-start items-start shrink">
      {row}
    </div>
  ));

  return <div className="flex flex-col">{rowsMapped}</div>;
};

export default BoardComponent;
