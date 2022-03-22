// ISLAND GAMES
const populateGeneratedMap = (nBombs, mapToPopulate) => {
  const map = [...mapToPopulate];
  const height = map.length;
  const width = map[0].length;

  let id = 0;
  let board = [];
  const bombIds = [];

  // create all tiles
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const newTile = {
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

  // get bomb positions
  const getRandomId = () => Math.floor(Math.random() * (width * height));
  const isWater = (id) => board.find((t) => t.id === id && t.type === 2);
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
    newTile.bomb = true;
    const newBoard = board.filter((t) => t.id !== bombId);
    board = [...newBoard, newTile];
  }

  const countNeighbourBombs = (tile) => {
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

  // count neighbouring bombs to get the cell number
  for (let tile of board) {
    const count = countNeighbourBombs(tile);
    tile.count = count;
  }

  // sort board
  board.sort((a, b) => a.id - b.id);

  return board;
};

// FOR REGULAR GAMES
const populateBoard = (width, height, nBombs) => {
  let id = 0;
  let board = [];
  const bombIds = [];

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
      const newTile = {
        id,
        count: -1,
        type: 2,
        x,
        y,
        bomb: false,
        flag: false,
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

  const countNeighbourBombs = (tile) => {
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

  // count neighbouring bombs to get the cell number
  for (let tile of board) {
    const count = countNeighbourBombs(tile);
    tile.count = count;
  }

  return board;
};

const recFloodFill = (tile, copiedBoard, tilesToReveal) => {
  // iterate neighbours
  for (let yoff = -1; yoff <= 1; yoff++) {
    for (let xoff = -1; xoff <= 1; xoff++) {
      // // break if outside of board
      // if (
      //   tile.x + xoff < 0 ||
      //   tile.x + xoff > 9 ||
      //   tile.y + yoff < 0 ||
      //   tile.y + yoff > 9
      // ) {
      //   break;
      // }
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

const startFloodFill = (tile, board, tilesToReveal) => {
  const copiedBoard = [...board];
  recFloodFill(tile, copiedBoard, tilesToReveal);

  return tilesToReveal;
};

const gameUtils = { populateBoard, populateGeneratedMap, startFloodFill };

export default gameUtils;
