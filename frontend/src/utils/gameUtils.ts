import { Board, Gamemode, TileType } from "../types";
import { generateOpenSeaBoard } from "./boardGeneration";

// Flood filling for smoothing islands
const recFloodFill = (
  tile: TileType,
  copiedBoard: TileType[],
  tilesToReveal: number[]
) => {
  // iterate neighbours
  for (let yoff = -1; yoff <= 1; yoff++) {
    for (let xoff = -1; xoff <= 1; xoff++) {
      const neighbour = copiedBoard.find(
        (t) => t.x === tile.x + xoff && t.y === tile.y + yoff
      );

      if (
        neighbour &&
        neighbour.type === 2 &&
        neighbour.id !== tile.id &&
        !neighbour.bomb &&
        !tilesToReveal.includes(neighbour.id)
      ) {
        tilesToReveal.push(neighbour.id);
        if (neighbour.count === 0) {
          recFloodFill(neighbour, copiedBoard, tilesToReveal);
        }
      }
    }
  }
  return tilesToReveal;
};

export const startFloodFill = (
  tile: TileType,
  board: TileType[],
  tilesToReveal: number[]
) => {
  const copiedBoard = [...board];
  recFloodFill(tile, copiedBoard, tilesToReveal);

  return tilesToReveal;
};

export const getGamemodeById = (gamemodes: Gamemode[], id: number) => {
  // get gamemode by id
  return (
    gamemodes.find((gamemode: Gamemode) => gamemode.id === id) || gamemodes[0]
  );
};

export const hideAllTiles = (boardToHide: Board): Board => {
  // hides all water tiles on board
  const { tiles } = boardToHide;
  // unreveal tiles
  const unrevealedTiles = tiles.map((t) =>
    t.type === 2 ? { ...t, revealed: false } : t
  );

  return { ...boardToHide, tiles: unrevealedTiles };
};

export const revealAllTiles = (boardToReveal: Board): Board => {
  // reveals all water tiles on board
  const { tiles } = boardToReveal;
  // map { revealed: true } to all water tiles
  const revealedTiles = tiles.map((t) =>
    t.type === 2 ? { ...t, revealed: true } : t
  );
  return { ...boardToReveal, tiles: revealedTiles };
};

export const countRevealedTiles = (boardToCount: Board): number => {
  // counts number of revealed
  const { tiles } = boardToCount;
  // filter for non-land tiles that are revealed and not a bomb
  const numRevealedTiles = tiles.filter(
    (t) => t.type !== 1 && t.revealed && !t.bomb
  ).length;

  return numRevealedTiles;
};

export const formatTime = (time: number) => {
  const timeInS = time / 1000;
  return Number(Math.round(Number(timeInS + "e" + 2)) + "e-" + 2);
};

const openSeaBoard = generateOpenSeaBoard(20, 20, 32);

export const gamemodes: Gamemode[] = [
  {
    name: "islands2032",
    label: "Islands",
    link: "/islands",
    width: 20,
    height: 20,
    numBombs: 32,
    nLighthouses: 2,
    nIslands: 10,
    clusterSpread: 4,
    keepFromBorder: false,
    id: 0,
    board: openSeaBoard,
  },
  {
    name: "kidspool1010",
    label: "Kiddie pool",
    link: "/kidspool",
    width: 10,
    height: 10,
    numBombs: 10,
    nLighthouses: 0,
    nIslands: 0,
    clusterSpread: 2,
    keepFromBorder: false,
    id: 1,
    board: openSeaBoard,
  },
  {
    name: "archipelago2032",
    label: "Archipelago",
    link: "/archipelago",
    width: 20,
    height: 20,
    numBombs: 32,
    nLighthouses: 3,
    nIslands: 20,
    clusterSpread: 2,
    keepFromBorder: false,
    id: 2,
    board: openSeaBoard,
  },
  {
    name: "pacificocean2032",
    label: "Pacific Islands",
    link: "/pacificocean",
    width: 20,
    height: 20,
    numBombs: 32,
    nLighthouses: 1,
    nIslands: 6,
    clusterSpread: 2,
    keepFromBorder: false,
    id: 3,
    board: openSeaBoard,
  },
  {
    name: "opensea2032",
    label: "Open sea",
    link: "/opensea",
    width: 20,
    height: 20,
    numBombs: 32,
    nLighthouses: 0,
    nIslands: 0,
    clusterSpread: 4,
    keepFromBorder: false,
    id: 4,
    board: openSeaBoard,
  },
  {
    name: "continent2032",
    label: "Continent",
    link: "/continent",
    width: 20,
    height: 20,
    numBombs: 32,
    nLighthouses: 2,
    nIslands: 3,
    clusterSpread: 10,
    keepFromBorder: true,
    id: 5,
    board: openSeaBoard,
  },
  // {
  //   name: "nightSailing",
  //   label: "Night Sailing",
  //   link: "/nightsailing",
  //   width: 14,
  //   height: 28,
  //   numBombs: 40,
  //   nLighthouses: 0,
  //   nIslands: 0,
  //   clusterSpread: 2,
  //   keepFromBorder: false,
  //   id: 6,
  //   board: openSeaBoard,
  // },
];
