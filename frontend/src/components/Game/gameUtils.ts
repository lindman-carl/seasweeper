import { MapArray, TileType, Board } from "../../types";

// ISLAND GAMES
const populateGeneratedMap = (nBombs: number, mapToPopulate: MapArray) => {
  const map = [...mapToPopulate];
  const height = map.length;
  const width = map[0].length;

  let id = 0;
  let board = [];

  // create all tiles
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const newTile: TileType = {
        x,
        y,
        id,
        marked: false,
        bomb: false,
        revealed: false,
        count: -1,
        type: map[y][x],
      };
      board.push(newTile);
      id++;
    }
  }

  const populatedBoard = populateBombs({
    board,
    width,
    height,
    nBombs,
  });

  return populatedBoard;
};

const countNeighbourBombs = (tile: TileType, board: TileType[]) => {
  let count = 0;

  if (tile.bomb) {
    return -1;
  } else {
    for (let yoff = -1; yoff <= 1; yoff++) {
      for (let xoff = -1; xoff <= 1; xoff++) {
        const neighbour = board.find(
          (t) => t.x === tile.x + xoff && t.y === tile.y + yoff
        );
        if (neighbour && neighbour.id !== tile.id && neighbour.bomb) {
          count++;
        }
      }
    }
  }

  return count;
};

const populateBombs = ({
  board,
  width,
  height,
  nBombs,
  bombIds = [],
}: Board) => {
  // get bomb positions
  let getRandomId;

  if (width && height) {
    getRandomId = () => Math.floor(Math.random() * (width * height));
  } else {
    getRandomId = () => Math.floor(Math.random() * board.length);
  }
  const isWater = (id: number) =>
    board.find((t) => t.id === id && t.type === 2);

  for (let i = 0; i < nBombs; i++) {
    let randomId = getRandomId();

    while (true) {
      randomId = getRandomId();
      if (!bombIds.includes(randomId) && isWater(randomId)) {
        break;
      }
    }
    bombIds.push(randomId);
  }

  // add bombs to board
  for (let bombId of bombIds) {
    const newTile = board.find((t) => t.id === bombId);
    if (newTile !== undefined) {
      newTile.bomb = true;
      const newBoard = board.filter((t) => t.id !== bombId);
      board = [...newBoard, newTile];
    }
  }

  // count neighbouring bombs to get the cell number
  for (let tile of board) {
    const count = countNeighbourBombs(tile, board);
    tile.count = count;
  }

  // sort board
  return board.sort((a, b) => a.id - b.id);
};

// FOR REGULAR GAMES
const populateBoard = (width: number, height: number, nBombs: number) => {
  let id = 0;
  let board: TileType[] = [];
  const bombIds: number[] = [];

  // get bomb positions
  for (let i = 0; i < nBombs; i++) {
    let randomId = Math.floor(Math.random() * (width * height));
    while (bombIds.includes(randomId)) {
      randomId = Math.floor(Math.random() * (width * height));
    }
    bombIds.push(randomId);
  }

  // create all tiles
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const newTile: TileType = {
        id,
        count: -1,
        type: 2,
        x,
        y,
        bomb: false,
        marked: false,
        lighthouse: false,
        lit: false,
        revealed: false,
      };
      if (bombIds.includes(newTile.id)) {
        // add bomb
        newTile.bomb = true;
      }
      board.push(newTile);
      id++;
    }
  }

  // count neighbouring bombs to get the cell number
  for (let tile of board) {
    const count = countNeighbourBombs(tile, board);
    tile.count = count;
  }

  return board;
};

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

const startFloodFill = (
  tile: TileType,
  board: TileType[],
  tilesToReveal: number[]
) => {
  const copiedBoard = [...board];
  recFloodFill(tile, copiedBoard, tilesToReveal);

  return tilesToReveal;
};

const gameUtils = {
  populateBoard,
  populateGeneratedMap,
  populateBombs,
  startFloodFill,
};

export default gameUtils;
