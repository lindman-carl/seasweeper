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
  img: any;
  w: number;
  h: number;
  numBombs: number;
  nLighthouses: number;
  nIslands: number;
  clusterSpread: number;
  id: number;
  board?: any;
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
