"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.generateValidIslandsMap = void 0;
var createBlankArray2D = function (w, h) {
    // creates an Array2D of 0 with size w x h
    var map = [];
    // generate map
    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            row.push(0);
        }
        map.push(row);
    }
    return map;
};
var getClusterPoint = function (centerPoint, clusterSpread) {
    // randomizes points around the center point
    // clusterSpread determines how far away the points can be from the centerPoint
    // larger clusterSpread means larger islands
    // randomize position offset
    var xoff = Math.floor(Math.random() * clusterSpread) - clusterSpread * 0.5;
    var yoff = Math.floor(Math.random() * clusterSpread) - clusterSpread * 0.5;
    // create new point
    var randomPoint = {
        x: centerPoint.x + xoff,
        y: centerPoint.y + yoff
    };
    return randomPoint;
};
var expandPoint = function (point, mapWidth, mapHeight, radius) {
    // expands a point with a radius within the given width and height limits of the map
    // this makes "square" islands which is the best for gameplay
    // returns an array of points
    var expandedPoints = []; // should be const
    // expand point
    for (var y = -radius; y < radius; y++) {
        for (var x = -radius; x < radius; x++) {
            // checks if point is within the map limits
            if (point.x + x >= 0 &&
                point.x + x < mapWidth &&
                point.y + y >= 0 &&
                point.y + y < mapHeight) {
                // creates new point
                var newPoint = {
                    x: point.x + x,
                    y: point.y + y
                };
                // checks for undefined properties, just in case
                if (newPoint.x === undefined || newPoint.y === undefined)
                    break;
                // add point to array
                expandedPoints.push(newPoint);
            }
        }
    }
    // trim duplicates from expandedPoints
    var trimmedExpandedPoints = __spreadArray([], __read(new Set(expandedPoints)), false);
    return trimmedExpandedPoints;
};
var generateIsland = function (mapWidth, mapHeight, amountClusterPoints, clusterSpread, keepFromBorder) {
    var e_1, _a, e_2, _b, e_3, _c;
    // generates an island with a given amount of cluster points and clusterSpread
    var map = createBlankArray2D(mapWidth, mapHeight);
    var borderInset = 0;
    // keep from border
    if (keepFromBorder)
        borderInset = 4;
    // generates a random center point for the island
    var centerPoint = {
        x: Math.floor(Math.random() * mapWidth),
        y: Math.floor(Math.random() * mapHeight)
    };
    // array of points that will be used to generate the island
    var clusterPoints = [centerPoint];
    // generate cluster points and add them to the clusterPoints array
    for (var i = 0; i < amountClusterPoints - 1; i++) {
        // generates a new cluster point
        var newClusterPoint = getClusterPoint(centerPoint, clusterSpread);
        while (newClusterPoint.x < 0 + borderInset ||
            newClusterPoint.x >= mapWidth - borderInset ||
            newClusterPoint.y < 0 + borderInset ||
            newClusterPoint.y >= mapHeight - borderInset ||
            newClusterPoint.x === undefined ||
            newClusterPoint.y === undefined) {
            // creates new random clusterpoints until it is within the map limits
            newClusterPoint = getClusterPoint(centerPoint, clusterSpread);
        }
        // add cluster point to array
        clusterPoints.push(newClusterPoint);
    }
    // filters out points that are outside the map limits, just in case
    var islandPoints = clusterPoints.filter(function (point) { return point.x >= 0 && point.y >= 0; });
    try {
        // expands each of the island points
        for (var clusterPoints_1 = __values(clusterPoints), clusterPoints_1_1 = clusterPoints_1.next(); !clusterPoints_1_1.done; clusterPoints_1_1 = clusterPoints_1.next()) {
            var clusterPoint = clusterPoints_1_1.value;
            // expands point with radius
            var expandedPoints = expandPoint(clusterPoint, mapWidth, mapHeight, 1);
            var trimmedPoints = [];
            var _loop_1 = function (point) {
                // skip points with undefined properties
                if (point.x === undefined || point.y === undefined)
                    return "continue";
                // skip points that are already in the trimmedPoints array
                if (trimmedPoints.find(function (p) { return p.x === point.x && p.y === point.y; }))
                    return "continue";
                // add point to trimmedPoints array
                trimmedPoints.push(point);
            };
            try {
                // this is probably not the most efficent way to do this, but it works
                for (var expandedPoints_1 = (e_2 = void 0, __values(expandedPoints)), expandedPoints_1_1 = expandedPoints_1.next(); !expandedPoints_1_1.done; expandedPoints_1_1 = expandedPoints_1.next()) {
                    var point = expandedPoints_1_1.value;
                    _loop_1(point);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (expandedPoints_1_1 && !expandedPoints_1_1.done && (_b = expandedPoints_1["return"])) _b.call(expandedPoints_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // add points to islandPoints array
            islandPoints.push.apply(islandPoints, __spreadArray([], __read(trimmedPoints), false));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (clusterPoints_1_1 && !clusterPoints_1_1.done && (_a = clusterPoints_1["return"])) _a.call(clusterPoints_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // trim again?
    var trimmedIslandCoords = __spreadArray([], __read(new Set(Object.values(islandPoints))), false);
    try {
        // add points to MapArray as 1
        for (var trimmedIslandCoords_1 = __values(trimmedIslandCoords), trimmedIslandCoords_1_1 = trimmedIslandCoords_1.next(); !trimmedIslandCoords_1_1.done; trimmedIslandCoords_1_1 = trimmedIslandCoords_1.next()) {
            var _d = trimmedIslandCoords_1_1.value, x = _d.x, y = _d.y;
            if (x === undefined || y === undefined || map === undefined)
                break;
            map[y][x] = 1;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (trimmedIslandCoords_1_1 && !trimmedIslandCoords_1_1.done && (_c = trimmedIslandCoords_1["return"])) _c.call(trimmedIslandCoords_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return map;
};
var addIslandToArray2D = function (map, islandMap) {
    // adds island to a existing MapArray
    var copiedMap = __spreadArray([], __read(map), false);
    // iterates through the islandMap and adds it to the copiedMap
    for (var y = 0; y < copiedMap.length; y++) {
        for (var x = 0; x < copiedMap[0].length; x++) {
            if (islandMap[y][x] === 1) {
                copiedMap[y][x] = 1;
            }
        }
    }
    return copiedMap;
};
var generateIslands = function (mapWidth, mapHeight, nIslands, clusterSpread, keepFromBorder) {
    var islands = [];
    // generate array of islands
    for (var i = 0; i < nIslands; i++) {
        // randomize each cluster's size
        var randomNumberCluster = Math.floor(Math.random() * 16) + 16;
        // generate island
        var newIsland = generateIsland(mapWidth, mapHeight, randomNumberCluster, clusterSpread, keepFromBorder);
        // add island to array
        islands.push(newIsland);
    }
    var map = islands[0]; // map start off as the first island
    // add islands to map
    for (var i = 1; i < islands.length; i++) {
        map = addIslandToArray2D(map, islands[i]);
    }
    return map;
};
var floodFillMap = function (islandMap) {
    // flood fills the islandMap to create a "water" map
    // smooths the map by removing small inlets and inaccessible areas
    var map = __spreadArray([], __read(islandMap), false);
    var count = 0;
    var rec = function (x, y, target_color, color) {
        // recursive function to flood fill the map
        // check if point is within map limits
        if (x < 0 || y < 0 || x >= map[0].length || y >= map.length)
            return;
        // get value of point
        var value = map[y][x];
        // check if point has already been visited
        if (value === color)
            return;
        // check if point is the target color
        if (value !== target_color)
            return;
        // eliminate vertical small inlets
        if (y - 1 >= 0 && y + 1 < map.length) {
            if (map[y - 1][x] === 1 && map[y + 1][x] === 1) {
                return;
            }
        }
        else if (y - 1 < 0 && map[y + 1][x] === 1) {
            return;
        }
        else if (y + 1 >= map.length && map[y - 1][x] === 1) {
            return;
        }
        // eliminate horizontal small inlets
        if (x - 1 >= 0 && x + 1 < map[0].length) {
            if (map[y][x - 1] === 1 && map[y][x + 1] === 1) {
                return;
            }
        }
        else if (x - 1 < 0 && map[y][x + 1] === 1) {
            return;
        }
        else if (x + 1 >= map[0].length && map[y][x - 1] === 1) {
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
    return { map: map, count: count };
};
var generateValidMap = function (mapWidth, mapHeight, amountIslands, clusterSpread, waterRatio, keepFromBorder) {
    if (waterRatio === void 0) { waterRatio = 0.6; }
    // generates maps until a valid map is found
    while (true) {
        var islandMap = generateIslands(mapWidth, mapHeight, amountIslands, clusterSpread, keepFromBorder);
        var _a = floodFillMap(islandMap), map = _a.map, count = _a.count;
        // lower water ratio if too few maps are valid
        if (count > mapWidth * mapHeight * waterRatio) {
            return map;
        }
    }
};
var mergeLayers = function (mapToMerge) {
    // makes all the water tiles the same value
    var map = __spreadArray([], __read(mapToMerge), false);
    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[0].length; x++) {
            if (map[y][x] === 0) {
                map[y][x] = 1;
            }
        }
    }
    return map;
};
var generateValidIslandsMap = function (mapWidth, heigth, nIslands, clusterSpread, waterRatio, keepFromBorder) {
    // generate map
    var validMap = generateValidMap(mapWidth, heigth, nIslands, clusterSpread, waterRatio, keepFromBorder);
    // merge layers
    var mergedMap = mergeLayers(validMap);
    return mergedMap;
};
exports.generateValidIslandsMap = generateValidIslandsMap;
