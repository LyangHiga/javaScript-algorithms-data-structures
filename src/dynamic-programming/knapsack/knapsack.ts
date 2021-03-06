import Item from "./item";

// Input: array of items {weight, value}
//        c (Capacity)
export const knapsack = (arr: Item[], c: number) => {
  const m: number[][] = Array.from({ length: arr.length + 1 }, () =>
    Array.from({ length: c + 1 }, () => 0)
  );
  // for each item
  for (let i = 1; i < m.length; i++) {
    for (let j = 0; j < c + 1; j++) {
      const v = arr[i - 1].value;
      const w = arr[i - 1].weight;
      if (j < w) m[i][j] = m[i - 1][j];
      else {
        m[i][j] = Math.max(m[i - 1][j], v + m[i - 1][j - w]);
      }
    }
  }
  return m;
};
