class Point {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
  }
}

// Returns the euclidean distance between two points
const dist = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const printPointList = (l) => {
  for (let i = 0; i < l.length; i++) {
    console.log(`${l[i].name}: (${l[i].x},${l[i].y})`);
  }
};

const printDist = (a, b) => {
  console.log(`Distance between ${a.name} and ${b.name} is ${dist(a, b)}`);
};

const compare = (a, b, c) => {
  if (c) return a.x < b.x;
  return a.y < b.y;
};

const merge = (left, right, c) => {
  let result = [],
    leftIndex = 0,
    rightIndex = 0;
  // while booth arrays have elements to compare, the smallest of each one,
  // take the smaller , push it to result and move idx
  while (leftIndex < left.length && rightIndex < right.length) {
    if (compare(left[leftIndex], right[rightIndex], c)) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  // one of them still has elemenst, already sorted, so we just need concat it with the result array
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }
  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }
  return result;
};

// if c is true compares by the x coordinate
// else compares by y coordinate
const mergeSort = (arr, c = true) => {
  if (arr.length < 2) {
    return arr;
  }
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left, c), mergeSort(right, c), c);
};

// Returns the pair and its distance
const closestPairBruteForce = (l) => {
  let min = Infinity;
  let pair = [];
  let d;
  for (let i = 0; i < l.length; i++) {
    for (let j = i + 1; j < l.length; j++) {
      d = dist(l[i], l[j]);
      if (d < min) {
        min = d;
        pair = [l[i], l[j]];
      }
    }
  }
  return [pair[0], pair[1], min];
};

// Returns: [point1, point2, distance] or [null,null, infinity] if dont find any pair
// inputs: list of points sorted in x and y coordinates, min dist found until now
const closestSplitPair = (px, py, delta) => {
  const mid = Math.floor(py.length / 2);
  // vertical line splits in 2 sets
  const line = px[mid];
  // list of points closer to line than delta in x coordinate, sorted by y coordinate
  const sy = [];
  for (let i = 0; i < py.length; i++) {
    // if the distance between the x coordinate of a given point is greater than delta
    // then the distance between this point and anyone else of the other side of this line
    // would be greater than delta, wich is a min dist already found
    if (Math.abs(py[i].x - line.x) < delta) {
      sy.push(py[i]);
    }
  }
  // if we dont find any candidate
  if (sy.length === 0) return [null, null, Infinity];
  let best = delta;
  let pair = [null, null];
  let d;
  // search by the best pair
  for (let i = 0; i < sy.length; i++) {
    //runs at most 15 times
    for (let j = i + 1; j < sy.length && j < 15; j++) {
      if (Math.abs(sy[j] - sy[i]) > delta) break;
      d = dist(sy[i], sy[j]);
      if (d < best) {
        pair = [sy[i], sy[j]];
        best = d;
      }
    }
  }
  return [pair[0], pair[1], best];
};

// Returns: [point1, point2, distance]
// input:
//  px:list of points sorted by x coordinate
//  py:list of points sorted by y coordinate
const closestPair = (px, py) => {
  // base case
  if (px.length <= 3) {
    return closestPairBruteForce(px);
  }
  const mid = Math.floor(px.length / 2);
  //   left part sorted by x coordinate
  let qx = [],
    //   left part sorted by y coordinate
    qy = [],
    //   right part sorted by x coordinate
    rx = [],
    //   right part sorted by y coordinate
    ry = [];

  // sorting qx, qy, rx, ry
  for (let i = 0; i < mid; i++) {
    qx.push(px[i]);
  }
  qy = mergeSort(qx, false);
  for (let i = mid; i < px.length; i++) {
    rx.push(px[i]);
  }
  ry = mergeSort(rx, false);

  const [p1, q1, d1] = closestPair(qx, qy);
  const [p2, q2, d2] = closestPair(rx, ry);
  // min distance foun until now
  const delta = Math.min(d1, d2);
  const [p3, q3, d3] = closestSplitPair(px, py, delta);
  // return the min found
  const min = Math.min(d1, d2, d3);
  if (min === d1) return [p1, q1, d1];
  if (min === d2) return [p2, q2, d2];
  return [p3, q3, d3];
};

// main fuction
// input: list of points
// returns: [point1,point2, distance]
const closestPairList = (l) => {
  // list l of points sorted by x coordinate
  const px = mergeSort(l, true);
  // list l of points sorted by y coordinate
  const py = mergeSort(l, false);
  return closestPair(px, py);
};

// gives a list of n points in range of x:(-n,+n) and y:(-r,+r)
const getPoints = (n, r) => {
  const list = [];
  let i = 0;
  let x;
  while (i < n) {
    if (Math.floor(Math.random() * 10) > 4) x = -1;
    else x = 1;
    list.push(
      new Point(
        Math.floor(Math.random() * r * x),
        Math.floor(Math.random() * r * x),
        i.toString()
      )
    );
    i++;
  }
  return list;
};

// number of times to test, size of ths list of points,
// range of random numbers
const test = (nTimes, lSize, random) => {
  let err = 0;
  let list = getPoints(lSize, random);
  let [p0, q0, d0] = closestPairList(list);
  console.log(`(${p0.name}, ${q0.name}): ${d0}`);
  let [p1, q1, d1] = closestPairBruteForce(list);
  console.log(`(${p1.name}, ${q1.name}): ${d1}`);
  if (d0 !== d1) err++;
  console.log('*******************************');
  for (let i = 0; i < nTimes; i++) {
    list = getPoints(lSize, random);
    [p0, q0, d0] = closestPairList(list);
    [p1, q1, d1] = closestPairBruteForce(list);
    if (d0 !== d1) err++;
  }
  console.log(`err = ${err}`);
};

test(1000000, 50, 10000);