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
};
