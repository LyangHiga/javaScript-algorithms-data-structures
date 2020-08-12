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

const closestSplitPair = (px, py, delta) => {
  const mid = Math.floor(py.length / 2);
  // vertical line splits in 2 sets
  const line = px[mid];
  const sy = [];
  for (let i = 0; i < py.length; i++) {
    // if the distance between the x coordinate of a given point is greater than delta
    // then the distance between this point and anyone else of the other side of this line
    // would be greater than delta
    if (Math.abs(py[i].x - line) < delta) {
      sy.push(py[i]);
    }
  }
  // if we dont find any candidate
  if (sy.length === 0) return [null, null, Infinity];
  let best = delta;
  let pair = [];
  let d;
  // search by the best pair
  //runs at most 6 times
  for (let i = 0; i < sy.length; i++) {
    for (let j = i + 1; j < 7 && sy[j].y - sy[i] < best; j++) {
      d = dist(sy[i], sy[j]);
      if (d < best) {
        pair = [sy[i], sy[j]];
        best = d;
      }
    }
  }
  return [pair[0], pair[1], best];
};

const closestPair = (px, py) => {
  // base case
  if (px.length <= 3) {
    return closestPairBruteForce(px);
  }

  const mid = Math.floor(px.length / 2);
  let qx = [],
    qy = [],
    rx = [],
    ry = [];

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
  const delta = Math.min(d1, d2);
  const [p3, q3, d3] = closestSplitPair(px, py, delta);
  const min = Math.min(d1, d2, d3);
  if (min === d1) return [p1, q1, d1];
  if (min === d2) return [p2, q2, d2];
  return [p3, q3, d3];
};

const closestPairList = (l) => {
  const px = mergeSort(l, true);
  const py = mergeSort(l, false);
  return closestPair(px, py);
};

const getPoints = (n, r) => {
  const list = [];
  const check = {};
  let i = 0;
  let x;
  let val;
  while (i < n) {
    if (Math.floor(Math.random() * 10) > 4) x = -1;
    else x = 1;
    val = Math.floor(x * i * Math.random());
    while (check[val] === true) {
      val = Math.floor(x * i * Math.random());
    }
    check[val] = true;
    list.push(new Point(val, Math.floor(Math.random() * r * x), i.toString()));
    i++;
  }
  return list;
};

const list = getPoints(3000, 1000);
console.log('*******************************');
const [p0, q0, d0] = closestPairList(list);
console.log(`(${p0.name}, ${q0.name}): ${d0}`);
const [p1, q1, d1] = closestPairBruteForce(list);
console.log(`(${p1.name}, ${q1.name}): ${d1}`);
