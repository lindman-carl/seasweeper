const generateBlankMap = (w, h) => {
  const map = [];
  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      row.push(0);
    }
    map.push(row);
  }

  return map;
};

const getClusterPoint = (centerPoint, clusterSpread) => {
  // randomize position offset
  const xoff = Math.floor(Math.random() * clusterSpread) - clusterSpread * 0.5;
  const yoff = Math.floor(Math.random() * clusterSpread) - clusterSpread * 0.5;

  const randomPoint = {
    x: centerPoint.x + xoff,
    y: centerPoint.y + yoff,
  };

  return randomPoint;
};

const expandPoint = (point, maxX, maxY) => {
  let expandedPoints = [];
  for (let y = -1; y < 1; y++) {
    for (let x = -1; x < 1; x++) {
      if (
        point.x + x >= 0 &&
        point.x + x < maxX &&
        point.y + y >= 0 &&
        point.y + y < maxY
      ) {
        const newPoint = {
          x: point.x + x,
          y: point.y + y,
        };
        if (newPoint.x === undefined || newPoint.y === undefined) break;
        expandedPoints.push(newPoint);
      }
    }
  }
  return expandedPoints;
};

const generateIsland = (w, h, nClusterPoints, clusterSpread) => {
  let map = generateBlankMap(w, h);

  const centerPoint = {
    x: Math.floor(Math.random() * w),
    y: Math.floor(Math.random() * h),
  };

  let clusterCoords = [centerPoint];

  for (let i = 0; i < nClusterPoints - 1; i++) {
    let clusterPoint = getClusterPoint(centerPoint, clusterSpread);
    while (
      clusterPoint.x < 0 ||
      clusterPoint.x >= w ||
      clusterPoint.y < 0 ||
      clusterPoint.y >= h ||
      clusterPoint.x === undefined ||
      clusterPoint.y === undefined
    ) {
      clusterPoint = getClusterPoint(centerPoint);
    }
    clusterCoords.push(clusterPoint);
  }

  let islandCoords = clusterCoords.filter((e) => e.x >= 0 && e.y >= 0);

  for (let clusterCoord of clusterCoords) {
    let expandedPoints = expandPoint(clusterCoord, w, h);
    // console.log(expandedPoints, expandedPoints.length);
    let trimmedPoints = [];
    for (let point of expandedPoints) {
      if (point.x === undefined || point.y === undefined) continue;
      if (trimmedPoints.find((p) => p.x === point.x && p.y === point.y))
        continue;
      trimmedPoints.push(point);
    }
    // console.log("trimmedPoints", trimmedPoints.length);
    islandCoords.push(...trimmedPoints);
  }

  const trimmedIslandCoords = [...new Set(Object.values(islandCoords))];

  for (let { x, y } of trimmedIslandCoords) {
    if (x === undefined || y === undefined || map === undefined) break;

    map[y][x] = 1;
  }

  return map;
};

const addIslandToMap = (map, islandMap) => {
  const copiedMap = [...map];

  for (let y = 0; y < copiedMap.length; y++) {
    for (let x = 0; x < copiedMap[0].length; x++) {
      if (islandMap[y][x] === 1) {
        copiedMap[y][x] = 1;
      }
    }
  }

  return copiedMap;
};

const generateIslandMap = (w, h, nIslands, clusterSpread) => {
  let islands = [];

  // generate islands
  for (let i = 0; i < nIslands; i++) {
    const randomNumberCluster = Math.floor(Math.random() * 16) + 16;
    const newIsland = generateIsland(w, h, randomNumberCluster, clusterSpread);
    islands.push(newIsland);
  }

  let map = islands[0]; // map start off as the first island

  // add islands
  for (let i = 1; i < islands.length; i++) {
    map = addIslandToMap(map, islands[i]);
  }

  return map;
};

const floodFillMap = (islandMap) => {
  let map = [...islandMap];
  let count = 0;
  // console.log("map before", map);
  const rec = (x, y, target_color, color) => {
    if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) return;

    const value = map[y][x];

    if (value === color) return;

    if (value !== target_color) return;

    // undvik för tajta vikar
    if (y - 1 >= 0 && y + 1 < map.length) {
      if (map[y - 1][x] === 1 && map[y + 1][x] === 1) {
        return;
      }
    } else if (y - 1 < 0 && map[y + 1][x] === 1) {
      return;
    } else if (y + 1 >= map.length && map[y - 1][x] === 1) {
      return;
    }
    if (x - 1 >= 0 && x + 1 < map[0].length) {
      if (map[y][x - 1] === 1 && map[y][x + 1] === 1) {
        return;
      }
    } else if (x - 1 < 0 && map[y][x + 1] === 1) {
      return;
    } else if (x + 1 >= map[0].length && map[y][x - 1] === 1) {
      return;
    }

    map[y][x] = color;
    count++;

    rec(x + 1, y, 0, 2);
    rec(x, y + 1, 0, 2);
    rec(x - 1, y, 0, 2);
    rec(x, y - 1, 0, 2);

    return;
  };

  rec(0, 0, 0, 2);

  return { map, count };
};

const generateValidMap = (w, h, nIslands, clusterSpread) => {
  while (true) {
    const islandMap = generateIslandMap(w, h, nIslands, clusterSpread);
    const { map, count } = floodFillMap(islandMap);

    if (count > w * h * 0.65) {
      return map;
    }
  }
};

const mergeLayers = (mapToMerge) => {
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

const generateValidMergedMap = (w, h, nIslands, clusterSpread) => {
  console.log("called generateValidMergedMap");
  const validMap = generateValidMap(w, h, nIslands, clusterSpread);
  const mergedMap = mergeLayers(validMap);
  return mergedMap;
};

const printMap = (map) => {
  for (let y = 0; y < map.length; y++) {
    console.log(
      map[y]
        .join(" ")
        .replaceAll("0", " ")
        .replaceAll("1", "#")
        .replaceAll("2", ".")
    );
  }
};

export { generateValidMergedMap, printMap };
