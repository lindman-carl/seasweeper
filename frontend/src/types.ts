export type HighscoreEntry = {
  playerName: string;
  time: number;
  rank: number;
  timestamp?: number;
  gameMode?: string;
  id?: string;
};

export type Gamemode = {
  name: string;
  label: string;
  link: string;
  width: number;
  height: number;
  numBombs: number;
  nLighthouses: number;
  nIslands: number;
  clusterSpread: number;
  id: number;
  board: Board;
  keepFromBorder: boolean;
};

export type TileType = {
  id: number;
  x: number;
  y: number;
  count: number;
  type: number;
  marked: boolean;
  bomb: boolean;
  revealed: boolean;
  lit?: boolean;
  lighthouse?: boolean;
};

export type Point = {
  x: number;
  y: number;
};

export type Array2D = number[][];

export type Board = {
  tiles: TileType[];
  width: number;
  height: number;
  numBombs: number;
  numWaterTiles: number;
  numRevealedTiles: number;
  bombIds?: number[];
};

export type GameState = {
  availableLighthouses: number;
  numPlacedMarkers: number;
  currentGamemode: Gamemode;
  gamemodes: Gamemode[];
  gameStarted: boolean;
  gameOver: boolean;
  gameWin: boolean;
  showGamemodeCarousel: boolean;
  isSendingHighscore: boolean;
  // time
  gameTime: number;
  gameStartTimestamp: number;
  intervalId: any;
  // placing modes
  lighthouseMode: boolean;
  markerMode: boolean;
};
