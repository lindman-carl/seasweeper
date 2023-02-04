// combinations of island generation parameters
// [nIslands, clusterSpread]
export const generationCombos = [
  [3, 10],
  [6, 2],
  [6, 4],
  [10, 2],
  [10, 4],
  [20, 2],
];
export const lighthouseOptions = [0, 1, 2, 3];

// get a random element from an array
export const randomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

// flatten 2d map to string
export const mapToString = (map) => {
  let results = "";
  for (const row of map) {
    let rowString = row.join("");
    results += rowString;
  }
  return results;
};

// zero-pad a number, if it's less than 10
const zeroPad = (num) => (num < 10 ? `0${num}` : num);

// get the current date as a string
// "YYYY-MM-DD" zero-padded, e.g. "2020-01-01", day and month is 1-indexed
export const getDateString = (date) =>
  `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(
    date.getDate()
  )}`;
