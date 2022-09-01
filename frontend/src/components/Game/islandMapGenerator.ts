import { Array2D, Point } from "../../types";

const createBlankArray2D = (w: number, h: number): Array2D => {
  // creates an Array2D of 0 with size w x h
  const map = [];

  // generate map
  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      row.push(0);
    }

    map.push(row);
  }

  return map;
};

const getClusterPoint = (centerPoint: Point, clusterSpread: number): Point => {
  // randomizes points around the center point
  // clusterSpread determines how far away the points can be from the centerPoint
  // larger clusterSpread means larger islands

  // randomize position offset
  const xoff = Math.floor(Math.random() * clusterSpread) - clusterSpread * 0.5;
  const yoff = Math.floor(Math.random() * clusterSpread) - clusterSpread * 0.5;

  // create new point
  const randomPoint: Point = {
    x: centerPoint.x + xoff,
    y: centerPoint.y + yoff,
  };

  return randomPoint;
};

const expandPoint = (
  point: Point,
  mapWidth: number,
  mapHeight: number,
  radius: number
): Point[] => {
  // expands a point with a radius within the given width and height limits of the map
  // this makes "square" islands which is the best for gameplay
  // returns an array of points

  let expandedPoints: Point[] = []; // should be const

  // expand point
  for (let y = -radius; y < radius; y++) {
    for (let x = -radius; x < radius; x++) {
      // checks if point is within the map limits
      if (
        point.x + x >= 0 &&
        point.x + x < mapWidth &&
        point.y + y >= 0 &&
        point.y + y < mapHeight
      ) {
        // creates new point
        const newPoint: Point = {
          x: point.x + x,
          y: point.y + y,
        };

        // checks for undefined properties, just in case
        if (newPoint.x === undefined || newPoint.y === undefined) break;

        // add point to array
        expandedPoints.push(newPoint);
      }
    }
  }
  // trim duplicates from expandedPoints
  const trimmedExpandedPoints = [...new Set(expandedPoints)];

  return trimmedExpandedPoints;
};

const generateIsland = (
  mapWidth: number,
  mapHeight: number,
  amountClusterPoints: number,
  clusterSpread: number,
  keepFromBorder: boolean
): Array2D => {
  // generates an island with a given amount of cluster points and clusterSpread
  const map = createBlankArray2D(mapWidth, mapHeight);
  let borderInset = 0;

  // keep from border
  if (keepFromBorder) borderInset = 4;

  // generates a random center point for the island
  const centerPoint: Point = {
    x: Math.floor(Math.random() * mapWidth),
    y: Math.floor(Math.random() * mapHeight),
  };

  // array of points that will be used to generate the island
  const clusterPoints: Point[] = [centerPoint];

  // generate cluster points and add them to the clusterPoints array
  for (let i = 0; i < amountClusterPoints - 1; i++) {
    // generates a new cluster point
    let newClusterPoint = getClusterPoint(centerPoint, clusterSpread);

    while (
      newClusterPoint.x < 0 + borderInset ||
      newClusterPoint.x >= mapWidth - borderInset ||
      newClusterPoint.y < 0 + borderInset ||
      newClusterPoint.y >= mapHeight - borderInset ||
      newClusterPoint.x === undefined ||
      newClusterPoint.y === undefined
    ) {
      // creates new random clusterpoints until it is within the map limits
      newClusterPoint = getClusterPoint(centerPoint, clusterSpread);
    }

    // add cluster point to array
    clusterPoints.push(newClusterPoint);
  }

  // filters out points that are outside the map limits, just in case
  const islandPoints = clusterPoints.filter(
    (point) => point.x >= 0 && point.y >= 0
  );

  // expands each of the island points
  for (let clusterPoint of clusterPoints) {
    // expands point with radius
    const expandedPoints = expandPoint(clusterPoint, mapWidth, mapHeight, 1);

    const trimmedPoints: Point[] = [];

    // this is probably not the most efficent way to do this, but it works
    for (let point of expandedPoints) {
      // skip points with undefined properties
      if (point.x === undefined || point.y === undefined) continue;

      // skip points that are already in the trimmedPoints array
      if (trimmedPoints.find((p) => p.x === point.x && p.y === point.y))
        continue;

      // add point to trimmedPoints array
      trimmedPoints.push(point);
    }

    // add points to islandPoints array
    islandPoints.push(...trimmedPoints);
  }

  // trim again?
  const trimmedIslandCoords = [...new Set(Object.values(islandPoints))];

  // add points to MapArray as 1
  for (let { x, y } of trimmedIslandCoords) {
    if (x === undefined || y === undefined || map === undefined) break;

    map[y][x] = 1;
  }

  return map;
};

const addIslandToArray2D = (map: Array2D, islandMap: Array2D): Array2D => {
  // adds island to a existing MapArray
  const copiedMap = [...map];

  // iterates through the islandMap and adds it to the copiedMap
  for (let y = 0; y < copiedMap.length; y++) {
    for (let x = 0; x < copiedMap[0].length; x++) {
      if (islandMap[y][x] === 1) {
        copiedMap[y][x] = 1;
      }
    }
  }

  return copiedMap;
};

const generateIslands = (
  mapWidth: number,
  mapHeight: number,
  nIslands: number,
  clusterSpread: number,
  keepFromBorder: boolean
): Array2D => {
  let islands = [];

  // generate array of islands
  for (let i = 0; i < nIslands; i++) {
    // randomize each cluster's size
    const randomNumberCluster = Math.floor(Math.random() * 16) + 16;

    // generate island
    const newIsland = generateIsland(
      mapWidth,
      mapHeight,
      randomNumberCluster,
      clusterSpread,
      keepFromBorder
    );

    // add island to array
    islands.push(newIsland);
  }

  let map = islands[0]; // map start off as the first island

  // add islands to map
  for (let i = 1; i < islands.length; i++) {
    map = addIslandToArray2D(map, islands[i]);
  }

  return map;
};

const floodFillMap = (islandMap: Array2D): { map: Array2D; count: number } => {
  // flood fills the islandMap to create a "water" map
  // smooths the map by removing small inlets and inaccessible areas

  let map = [...islandMap];
  let count = 0;

  const rec = (x: number, y: number, target_color: number, color: number) => {
    // recursive function to flood fill the map

    // check if point is within map limits
    if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) return;

    // get value of point
    const value = map[y][x];

    // check if point has already been visited
    if (value === color) return;

    // check if point is the target color
    if (value !== target_color) return;

    // eliminate vertical small inlets
    if (y - 1 >= 0 && y + 1 < map.length) {
      if (map[y - 1][x] === 1 && map[y + 1][x] === 1) {
        return;
      }
    } else if (y - 1 < 0 && map[y + 1][x] === 1) {
      return;
    } else if (y + 1 >= map.length && map[y - 1][x] === 1) {
      return;
    }

    // eliminate horizontal small inlets
    if (x - 1 >= 0 && x + 1 < map[0].length) {
      if (map[y][x - 1] === 1 && map[y][x + 1] === 1) {
        return;
      }
    } else if (x - 1 < 0 && map[y][x + 1] === 1) {
      return;
    } else if (x + 1 >= map[0].length && map[y][x - 1] === 1) {
      return;
    }

    // set visited
    map[y][x] = color;

    // increase water tile count
    count++;

    // recursively call flood fill in all directions
    rec(x + 1, y, 0, 2);
    rec(x, y + 1, 0, 2);
    rec(x - 1, y, 0, 2);
    rec(x, y - 1, 0, 2);

    return;
  };

  // lets go!
  rec(0, 0, 0, 2);

  // returns the map and the number of water tiles
  return { map, count };
};

const generateValidMap = (
  mapWidth: number,
  mapHeight: number,
  amountIslands: number,
  clusterSpread: number,
  waterRatio: number = 0.6,
  keepFromBorder: boolean
): Array2D => {
  // generates maps until a valid map is found
  while (true) {
    const islandMap = generateIslands(
      mapWidth,
      mapHeight,
      amountIslands,
      clusterSpread,
      keepFromBorder
    );

    const { map, count } = floodFillMap(islandMap);
    // lower water ratio if too few maps are valid
    if (count > mapWidth * mapHeight * waterRatio) {
      return map;
    }
  }
};

const mergeLayers = (mapToMerge: Array2D): Array2D => {
  // makes all the water tiles the same value
  const map = [...mapToMerge];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 0) {
        map[y][x] = 1;
      }
    }
  }

  return map;
};

const generateValidIslandsMap = (
  mapWidth: number,
  heigth: number,
  nIslands: number,
  clusterSpread: number,
  waterRatio: number,
  keepFromBorder: boolean
) => {
  // generate map
  const validMap = generateValidMap(
    mapWidth,
    heigth,
    nIslands,
    clusterSpread,
    waterRatio,
    keepFromBorder
  );
  // merge layers
  const mergedMap = mergeLayers(validMap);

  return mergedMap;
};

// const printMap = (map: Array2D) => {
//   for (let y = 0; y < map.length; y++) {
//     console.log(
//       map[y]
//         .join(" ")
//         .replaceAll("0", " ")
//         .replaceAll("1", "#")
//         .replaceAll("2", ".")
//     );
//   }
// };

export { generateValidIslandsMap };
