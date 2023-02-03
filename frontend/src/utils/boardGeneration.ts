import { generateValidIslandsMap } from "./islandMapGenerator";
import { Array2D, Board, Gamemode, TileType } from "../types";
import { hideAllTiles } from "./gameUtils";

// ISLAND GAMES
const populateGeneratedMap = (
  numBombs: number,
  mapToPopulate: Array2D
): Board => {
  const map = [...mapToPopulate];
  const height = map.length;
  const width = map[0].length;

  let id = 0;
  let tiles = [];

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
      tiles.push(newTile);
      id++;
    }
  }
  // count water tiles
  const numWaterTiles = tiles.filter((tile) => tile.type !== 1).length;

  const populatedBoard: Board = populateBombs({
    tiles,
    width,
    height,
    numBombs,
    numWaterTiles,
    numRevealedTiles: 0,
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

export const populateBombs = ({
  tiles,
  width,
  height,
  numBombs,
  numWaterTiles,
}: Board) => {
  // get bomb positions
  let getRandomId;
  const bombIds: number[] = [];

  if (width && height) {
    getRandomId = () => Math.floor(Math.random() * (width * height));
  } else {
    getRandomId = () => Math.floor(Math.random() * tiles.length);
  }
  const isWater = (id: number) =>
    tiles.find((t) => t.id === id && t.type === 2);

  for (let i = 0; i < numBombs; i++) {
    let randomId = getRandomId();

    while (true) {
      randomId = getRandomId();
      if (!bombIds.includes(randomId) && isWater(randomId)) {
        break;
      }
    }
    bombIds.push(randomId);
  }

  // add bombs to tiles
  for (let bombId of bombIds) {
    const newTile = tiles.find((t) => t.id === bombId);
    if (newTile !== undefined) {
      newTile.bomb = true;
      const newTiles = tiles.filter((t) => t.id !== bombId);
      tiles = [...newTiles, newTile];
    }
  }

  // count neighbouring bombs to get the cell number
  for (let tile of tiles) {
    const count = countNeighbourBombs(tile, tiles);
    tile.count = count;
  }

  // sort tiles
  const tilesSorted = tiles.sort((a, b) => a.id - b.id);

  const newBoard: Board = {
    tiles: tilesSorted,
    width,
    height,
    numBombs,
    numWaterTiles,
    numRevealedTiles: 0,
  };

  return newBoard;
};

// FOR REGULAR GAMES
export const generateOpenSeaBoard = (
  width: number = 20,
  height: number = 20,
  numBombs: number = 32
): Board => {
  let id = 0;
  let tiles: TileType[] = [];
  const bombIds: number[] = [];

  // get bomb positions
  for (let i = 0; i < numBombs; i++) {
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
      tiles.push(newTile);
      id++;
    }
  }

  // count neighbouring bombs to get the cell number
  for (let tile of tiles) {
    const count = countNeighbourBombs(tile, tiles);
    tile.count = count;
  }

  // count water tiles
  const numWaterTiles = tiles.filter((tile) => tile.type !== 1).length;

  const newBoard: Board = {
    tiles,
    width,
    height,
    numBombs,
    bombIds,
    numWaterTiles,
    numRevealedTiles: 0,
  };

  return newBoard;
};

const generateIslandBoard = ({
  width,
  height,
  nIslands,
  clusterSpread,
  keepFromBorder,
  numBombs,
}: Gamemode): Board => {
  // generate a map and make a game board out of it
  // creates the map async, to keep the app responsive
  const tempMap = generateValidIslandsMap(
    width,
    height,
    nIslands,
    clusterSpread,
    0.6,
    keepFromBorder
  );

  const tempBoard = populateGeneratedMap(numBombs, tempMap);

  return tempBoard;
};

export const generateBoard = (gamemode: Gamemode) => {
  const { width, height, numBombs, nIslands } = gamemode;
  // generates a new board
  let newBoard;

  if (nIslands > 0) {
    // generate map with islands
    newBoard = generateIslandBoard(gamemode);
  } else {
    // generates map without islands
    newBoard = generateOpenSeaBoard(width, height, numBombs);
  }
  return newBoard;
};

export const generateBoardFrom2DArray = (
  array: number[][],
  numBombs: number
) => {
  const board = populateGeneratedMap(numBombs, array);
  return board;
};

export const generateBoardsForAllGamemodes = async (
  gamemodes: Gamemode[]
): Promise<Gamemode[]> => {
  // generates maps for each gamemode asynchronously
  const gamemodesWithNewBoards: Gamemode[] = await Promise.all(
    gamemodes.map((gamemode) => {
      const newBoard = generateBoard(gamemode);
      const gamemodeWithNewBoard = { ...gamemode, board: newBoard };
      return gamemodeWithNewBoard;
    })
  );
  return gamemodesWithNewBoards;
};

export const generateBoardForSpecificGamemode = (
  gamemodes: Gamemode[],
  id: number
): Gamemode[] => {
  // generates one new board by id
  // const oldMappedGamemode = mappedGamemodes.find((gm) => gm.id === id);

  try {
    const gamemodeToGenerate = gamemodes.find((gm) => gm.id === id);

    if (gamemodeToGenerate === undefined) {
      throw new Error(`No gamemode with id of ${id}`);
    }

    const newBoard = generateBoard(gamemodeToGenerate);
    const gamemodeWithNewBoard = { ...gamemodeToGenerate, board: newBoard };
    const gamemodesWithNewBoard = [
      ...gamemodes.filter((gamemode) => gamemode.id !== id),
      gamemodeWithNewBoard,
    ];

    return gamemodesWithNewBoard.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error(error);
    // return input
    return gamemodes;
  }
};

export const depopulateBoard = (boardToDepopulate: Board) => {
  // remove all bombs and player interactions from board
  const depopulatedTiles = boardToDepopulate.tiles.map((tile) => ({
    ...tile,
    bomb: false,
    marked: false,
    lighthouse: false,
    lit: false,
    count: -1,
  }));

  return { ...boardToDepopulate, tiles: depopulatedTiles };
};

export const repopulateBoard = (board: Board, gamemode: Gamemode) => {
  // generate new bombs on board
  // dont generate islands on open sea
  if (gamemode.nIslands === 0) {
    const { width, height, numBombs } = gamemode;
    return generateOpenSeaBoard(width, height, numBombs);
  }
  // remove all bombs from board
  const depopulatedBoard = depopulateBoard(board);
  // generate new bombs to board
  const repopulatedBoard = populateBombs(depopulatedBoard);
  // hide/unreveal all tiles
  const finalBoard = hideAllTiles(repopulatedBoard);

  return finalBoard;
};
