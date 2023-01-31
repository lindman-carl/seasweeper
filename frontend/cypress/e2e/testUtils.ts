export const getRandomIndices = (amt: number, array: any[]) => {
  const indices = [];
  const cache: { [idx: number]: boolean } = {};
  while (indices.length < amt) {
    const idx = Math.floor(Math.random() * array.length);
    if (!cache[idx]) {
      cache[idx] = true;
      indices.push(idx);
    }
  }
  return indices;
};
