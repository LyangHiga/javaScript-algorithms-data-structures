import selectionSort from "./selectionSort";

describe("Selection Sort Test", () => {
  test("Testing if SS sort a random array", () => {
    const nTimes = 100;
    const SIZE = 100;
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      selectionSort(arr);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(arr).toEqual(jsSortedArr);
    }
  });
});
