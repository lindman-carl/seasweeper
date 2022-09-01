import { generateValidMergedMap } from "../components/Game/islandMapGenerator";
import { MapArray, TileType, Board, Gamemode } from "../types";

// ISLAND GAMES
const populateGeneratedMap = (
  numBombs: number,
  mapToPopulate: MapArray
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
  bombIds = [],
  numWaterTiles,
}: Board) => {
  // get bomb positions
  let getRandomId;

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
export const populateBoard = (
  width: number,
  height: number,
  numBombs: number
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

export const getBlankBoard = (
  width: number = 20,
  height: number = 20,
  numBombs: number = 32
): Board => {
  const blankBoard = populateBoard(width, height, numBombs);

  return blankBoard;
};

export const getGamemodeById = (gamemodes: Gamemode[], id: number) => {
  // get gamemode by id
  return gamemodes.find((gm: Gamemode) => gm.id === id) || gamemodes[0];
};

export const generateBoard = ({
  width,
  height,
  numBombs,
  nIslands,
  clusterSpread,
  keepFromBorder,
}: Gamemode) => {
  // generates a new board
  let tempBoard;

  if (nIslands > 0) {
    // generate map with islands
    const tempMap = generateValidMergedMap(
      width,
      height,
      nIslands,
      clusterSpread,
      0.6,
      keepFromBorder
    );
    // populate map with bombs
    tempBoard = populateGeneratedMap(numBombs, tempMap);
  } else {
    // generates map without islands
    tempBoard = populateBoard(width, height, numBombs);
  }
  return tempBoard;
};

export const generateIslandBoard = ({
  width,
  height,
  nIslands,
  clusterSpread,
  keepFromBorder,
  numBombs,
}: Gamemode): Board => {
  // generate a map and make a game board out of it
  // creates the map async, to keep the app responsive
  const tempMap = generateValidMergedMap(
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

export const generateBoardForSingleGamemode = (
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

const blankBoard = getBlankBoard();

export const hideAllTiles = (boardToUnreveal: Board): Board => {
  // reveals all water tiles on board
  const { tiles } = boardToUnreveal;
  // unreveal tiles
  const unrevealedTiles = tiles.map((t) =>
    t.type === 2 ? { ...t, revealed: false } : t
  );

  return { ...boardToUnreveal, tiles: unrevealedTiles };
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
    return getBlankBoard(width, height, numBombs);
  }
  // remove all bombs from board
  const depopulatedBoard = depopulateBoard(board);
  // generate new bombs to board
  const repopulatedBoard = gameUtils.populateBombs(depopulatedBoard);
  // hide/unreveal all tiles
  const finalBoard = hideAllTiles(repopulatedBoard);

  return finalBoard;
};

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
    board: blankBoard,
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
    board: blankBoard,
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
    board: blankBoard,
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
    board: blankBoard,
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
    board: blankBoard,
  },
  {
    name: "continent2032",
    label: "Continent",
    link: "/continent",
    width: 20,
    height: 20,
    numBombs: 32,
    nLighthouses: 0,
    nIslands: 3,
    clusterSpread: 10,
    keepFromBorder: true,
    id: 5,
    board: blankBoard,
  },
];

const gameUtils = {
  populateBoard,
  populateGeneratedMap,
  populateBombs,
  startFloodFill,
};

export default gameUtils;
