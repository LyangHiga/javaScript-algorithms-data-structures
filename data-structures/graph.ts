const fs = require("fs");
const Queue = require("./queue");
const Stack = require("./stack");
const MinHeap = require("./minHeap");
const FibonacciHeap = require("./fibonacciHeap");

// Returns a random number between [min,max)
const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

type weight = { node: string; weight: number };
type unweight = { node: string };

class Graph {
  // FIXME:
  //   list: { [key: string]: weight[] | unweight[] };
  //   list: Map<string, weight | unweight>;
  list: any;

  currentLabel: null | number;
  private size: number;
  constructor(public directed = false) {
    this.list = {};
    // this.list = new Map();
    // to implement topologicalSort
    this.currentLabel = null;
    this.size = 0;
  }

  //   **********************************************************
  //                            HELPERS
  //   **********************************************************

  // print this Graph
  //   FORMAT: <first vertex u> - <second vertex v> - <edge w>
  print = () => {
    for (let u in this.list) {
      for (let v in this.list[u]) {
        if (!this.directed) {
          if (this.list[u][v].weight) {
            console.log(
              `${u} - ${this.list[u][v].node} - ${this.list[u][v].weight}`
            );
          } else {
            console.log(`${u} - ${this.list[u][v].node}`);
          }
        } else {
          if (this.list[u][v].weight) {
            console.log(
              `${u} -> ${this.list[u][v].node} - ${this.list[u][v].weight}`
            );
          } else {
            console.log(`${u} -> ${this.list[u][v].node}`);
          }
        }
      }
    }
  };

  // Returns true if this list constains this vertex v
  // Otherwise returns false
  contains = (v: string) => {
    if (this.list[v] === undefined) return false;
    return true;
  };

  // Returns true if v is a neighbour of u
  // otherwise returns false
  isNeighbour = (u: string, v: string) => {
    // check if u is already in this list
    if (!this.contains(u)) return false;
    // if v is already in list[u] return true
    for (let i = 0; i < this.list[u].length; i++) {
      if (this.list[u][i].node === v) return true;
    }
    return false;
  };

  // Returns how many edges are between verteces u and v
  hme = (u: string, v: string) => {
    let c = 0;
    for (let i = 0; i < this.list[u].length; i++) {
      if (this.list[u][i].node === v) c++;
    }
    return c;
  };

  // Returns the number of edges of this graph
  countEdges = () => {
    let c = 0;
    for (let u in this.list) {
      for (let v in this.list[u]) {
        c++;
      }
    }
    return c / 2;
  };

  // Returns the key of two neighbours [u,v]
  pickRandomEdge = (): [string, string] => {
    const keys = Object.keys(this.list);
    const uIdx = random(0, keys.length);
    const u = keys[uIdx];
    const vIdx = random(0, this.list[u].length);
    const v = this.list[u][vIdx].node;
    return [u, v];
  };

  // Merge two verteces into a single one
  mergeVerteces = (u: string, v: string) => {
    // adds all neighbours of v to u
    // and removes from v
    while (this.contains(v) && this.size > 2 && this.contains(u)) {
      const w = this.list[v][0].node;
      // not allow self-loops
      if (w !== u) {
        if (this.contains(w) && this.contains(u)) {
          // we need to add (u,w) the same number of times that we remove (v,w)
          const c = this.hme(v, w);
          for (let i = 0; i < c; i++) {
            this.addEdge(u, w);
          }
        }
      }
      this.removeEdge(v, w);
      // if v or w does not have any other neighbour remove it from this graph
      this.removeDegreeZero(v);
      this.removeDegreeZero(w);
    }
  };

  // Returns a new directed Graph with all edges of this reversed
  reverse = () => {
    // if this is not a directed graph returns false
    if (!this.directed) return false;
    const g = new Graph(true);
    for (let u in this.list) {
      for (let v in this.list[u]) {
        if (this.list[u][v].weight) {
          g.addVertecesAndEdge(this.list[u][v].node, u, this.list[u][v].weight);
        } else {
          g.addVertecesAndEdge(this.list[u][v].node, u);
        }
      }
    }
    return g;
  };

  //   **********************************************************
  //                            INSERT
  //   **********************************************************

  // Adds an empty array to the new vertice v
  // Returns this list
  // If v is already in this list do nothing
  addVertex = (v: string) => {
    if (!this.list[v]) {
      this.list[v] = [];
      this.size++;
      return this;
    }
    // if v is already in this list do nothing
    return;
  };

  // adds v to neighbour list of u
  // ( and v to u neighbour list if it's a undirected graph )
  // O(1) - but dont check for duplications
  // DONT PASS DUPLICATES !
  addEdge = (u: string, v: string, weight = 0) => {
    // unweighted graph
    if (weight === 0) {
      this.list[u].push({ node: v });
      if (!this.directed) this.list[v].push({ node: u });
      return this;
    }
    // weighted graph
    this.list[u].push({ node: v, weight });
    if (!this.directed) this.list[v].push({ node: u, weight });
    return this;
  };

  // Adds both u and v verteces and their edge w
  addVertecesAndEdge = (u: string, v: string, w = 0) => {
    this.addVertex(u);
    this.addVertex(v);
    this.addEdge(u, v, w);
  };

  //   **********************************************************
  //                            DELETE
  //   **********************************************************

  // Removes v from neighbour list of u (and v from u neighbour list if undirected)
  // Returns this list
  removeEdge = (u: string, v: string) => {
    this.list[u] = this.list[u].filter((w: { node: string }) => w.node !== v);
    if (!this.directed) {
      this.list[v] = this.list[v].filter((w: { node: string }) => w.node !== u);
    }
    return this;
  };

  // Removes all edges of v and v itself
  //  Returns this list
  removeVertex = (v: string) => {
    while (this.list[v].length) {
      const u = this.list[v].pop();
      this.removeEdge(u, v);
    }
    delete this.list[v];
    this.size--;
    return this;
  };

  // If u does not have any neighbour, iow has degree zero
  // Removes u
  // Returns this graph
  // Returns false if u is not in this graph
  removeDegreeZero = (u: string) => {
    if (!this.contains(u)) return false;
    if (this.list[u].length === 0) {
      // if v was the only neighbour of v (the adj list of u is now empty)
      // removes u
      this.removeVertex(u);
    }
    return this;
  };

  //   **********************************************************
  //                            CREATING
  //   **********************************************************

  // Add all verteces and edges to this graph from a file
  // File is the adj list of this Graph
  // FORMAT: <first vertex u>' '<second vertex v>' ' <edge w>
  create = (file: string): false | void => {
    // check if this is a 'empty graph'
    if (this.size !== 0) return false;
    const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];
    for (let char in data) {
      if (data[char] !== "\n") {
        line += data[char];
      } else {
        split = line.trim().split(" ");
        this.addVertecesAndEdge(split[0], split[1], parseInt(split[2]));
        line = "";
      }
    }
    // check if the last line is empty
    if (line !== "") {
      split = line.trim().split(" ");
      this.addVertecesAndEdge(split[0], split[1], parseInt(split[2]));
    }
  };

  // Add all verteces and edges to this graph from a file
  // File is the adj list of this Graph
  // FORMAT: <vertex u>' => neighbours: '<vertex v>' ... '<vertex n>'
  // This format allow duplicate edges, we need to handle
  createListAdj = (file: string): false | void => {
    // check if this is a 'empty graph'
    if (this.size !== 0) return false;
    const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];
    for (let char in data) {
      if (data[char] !== "\n") {
        line += data[char];
      } else {
        split = line.trim().split(" ");
        const u = split[0];
        while (split.length > 1) {
          const v = split.pop()!;
          // to avoid duplicate edges
          if (!this.isNeighbour(u, v)) {
            // whether v is not neighbour of u
            this.addVertecesAndEdge(u, v);
          }
        }
        line = "";
      }
    }
    // check if the last line is empty
    if (line !== "") {
      split = line.trim().split(" ");
      const u = split[0];
      while (split.length > 1) {
        const v = split.pop()!;
        // to avoid duplicate edges
        if (!this.isNeighbour(u, v)) {
          // whether v is not neighbour of u
          this.addVertecesAndEdge(u, v);
        }
      }
    }
  };

  // Add all verteces and edges to this graph from a file
  // File is the adj list of this Graph
  // FORMAT: <vertex u>' => neighbours: '<vertex v>,weight' ... '<vertex n>,weight'
  // This format allow duplicate edges, we need to handle
  createListAdjWeighted = (file: string): false | void => {
    // check if this is a 'empty graph'
    if (this.size !== 0) return false;
    const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];
    for (let char in data) {
      if (data[char] !== "\n") {
        line += data[char];
      } else {
        split = line.trim().split("	");
        const u = split[0];
        while (split.length > 1) {
          const t = split.pop()!;
          const v = t.split(",");
          // to avoid duplicate edges
          if (!this.isNeighbour(u, v[0])) {
            // whether v is not neighbour of u
            this.addVertecesAndEdge(u, v[0], parseInt(v[1]));
          }
        }
        line = "";
      }
    }
    // check if the last line is empty
    if (line !== "") {
      split = line.trim().split("	");
      const u = split[0];
      while (split.length > 1) {
        const t = split.pop()!;
        const v = t.split(",");
        // to avoid duplicate edges
        if (!this.isNeighbour(u, v[0])) {
          // whether v is not neighbour of u
          this.addVertecesAndEdge(u, v[0], parseInt(v[1]));
        }
      }
    }
  };

  // Add all verteces and edges to this graph from a file
  // File is the adj list of this Graph
  // FORMAT: <first vertex u>' '<second vertex v>
  // it is a drirected graph, the edge goes from u to v, i.e.: u -> v
  createDirected = (file: string): false | void => {
    // check if this is a 'empty graph'
    if (this.size !== 0) return false;
    // set this graph as directed
    this.directed = true;
    const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];
    for (let char in data) {
      if (data[char] !== "\n") {
        line += data[char];
      } else {
        split = line.trim().split(" ");
        this.addVertecesAndEdge(split[0], split[1]);
        line = "";
      }
    }
    // check if the last line is empty
    if (line !== "") {
      split = line.trim().split(" ");
      this.addVertecesAndEdge(split[0], split[1]);
    }
  };

  //   **********************************************************
  //                            ALGORITHMS
  //   **********************************************************

  // Returns a min cut
  // We need to execute a sufficient number of times to have a high prob to find the min cut
  kargerMinCut = () => {
    while (this.size > 2) {
      // pick a random edge
      const [u, v] = this.pickRandomEdge();
      // contract randomly edges (u,v) until only two verteces remain
      this.mergeVerteces(u, v);
    }
    return this.countEdges();
  };

  // Returns: a list of all verteces found (in the order of dequeue)
  //    the parent of each visited vertex
  //    the distance of s to each visited vertex
  //    all visited verteces
  bfs = (s: string) => {
    // the order of each vertex is dequeue
    const result: unweight[] = [];
    const dist: Map<string, number> = new Map();
    const parents: Map<string, null | string> = new Map();
    const visited: Map<string, boolean> = new Map();
    const q = new Queue();
    // add s to the queue
    q.enQueue(s);
    // mark s as visited
    visited.set(s, true);
    dist.set(s, 0);
    parents.set(s, null);
    // FIXME: Node Queue type
    let v: any;
    while (q.size !== 0) {
      v = q.deQueue();
      result.push(v.key);
      this.list[v.key].forEach((u: unweight) => {
        // if u unvisited
        if (!visited.get(u.node)) {
          // mark u as visited
          visited.set(u.node, true);
          // add u to the queue
          q.enQueue(u.node);
          parents.set(u.node, v.key);
          dist.set(u.node, dist.get(v.key)! + 1);
        }
      });
    }
    return { result, parents, dist, visited };
  };

  // Returns a list with all connected components of G
  undirectConnectivity = () => {
    const components: unweight[][] = new Array();
    const isVisited: Map<string, boolean> = new Map();
    // a single component after to execute one bfs
    for (let u in this.list) {
      // check if node u was already visited before
      if (!isVisited.get(u)) {
        const { result, visited } = this.bfs(u);
        // updtade visited nodes after this bfs
        for (const [key, value] of visited) {
          isVisited.set(key, value);
        }
        // add this new result
        components.push(result);
      }
    }
    return components;
  };

  // dfs iterative
  dfs = (s: string) => {
    const result: string[] = new Array();
    const dist: Map<string, number> = new Map();
    const parents: Map<string, null | string> = new Map();
    const visited: Map<string, boolean> = new Map();
    const labeledOrder: Map<string, number | null> = new Map();
    // finish order
    const finish: Map<number, string> = new Map();
    const stack = new Stack();
    // add s tothe stack
    stack.push(s);
    // mark s as visited
    visited.set(s, true);
    dist.set(s, 0);
    // FIXME: Stack Node type
    let v: any;
    let i = 0;
    while (stack.size !== 0) {
      // take from the top of the stack
      v = stack.pop();
      result.push(v.key);
      // add parent of v wich is the last one poped
      if (i === 0) {
        parents.set(v.key, null);
      } else {
        parents.set(v.key, result[i - 1]);
      }
      i++;
      // for every edge of v
      this.list[v.key].forEach((u: unweight) => {
        //  v unvisited
        if (!visited.get(u.node)) {
          // mark u as visited
          visited.set(u.node, true);
          // add u to the stack
          stack.push(u.node);
          // calc dist
          dist.set(u.node, dist.get(v.key)! + 1);
        }
      });
      if (!labeledOrder.get(v.key)) {
        labeledOrder.set(v.key, this.currentLabel);
        finish.set(this.currentLabel!, v.key);
        this.currentLabel!++;
      }
    }
    return {
      result,
      parents,
      dist,
      labeledOrder,
      visited,
      finish,
    };
  };

  // Returns the labeled order and finish order
  // Does not work for cycled graphs, only DAGs
  topologicalSort() {
    const labeledOrder: Map<string, number | null> = new Map();
    const visited: Map<string, boolean> = new Map();
    const finish: Map<number, string> = new Map();
    // to keep track of ordering
    this.currentLabel = 0;
    let r;
    for (let u in this.list) {
      if (!visited.get(u)) {
        const r = this.dfs(u);
        // update values
        for (const [key, value] of r.visited) {
          visited.set(key, value);
        }
        for (const [key, value] of r.labeledOrder) {
          labeledOrder.set(key, value);
        }
        for (const [key, value] of r.finish) {
          finish.set(key, value);
        }
      }
    }
    return { labeledOrder, finish };
  }

  // TODO: Finish Refactoring

  // Returns the size of each Strong Component
  // the id of each SC is its Leader
  kojaru() {
    // reverse G
    const gRerv = this.reverse();
    // finish order
    const { finish } = gRerv.topologicalSort();
    const finishTime = Object.values(finish);
    let visited = {};
    // the vertex who calls dfs
    const leader = {};
    let u, r;
    for (let i = finishTime.length - 1; i > 0; i--) {
      u = finishTime[i];
      if (!visited[u]) {
        r = this.dfs(u);
        // update visited
        visited = { ...visited, ...r.visited };
        // all verteces visited have u as leader
        leader[u] = r.result.length;
      }
    }
    return leader;
  }

  // Returns the distance from s to each vertex and their parents
  // Inputs:
  //    s: source vertex
  //    h: to choose between binary and fibonacci heap
  //   'b' (default) for binaryHeap
  //   'f' for FibonacciHeap
  dijkstra = (s, h = "b") => {
    if (h === "b") {
      // we should use 'var' declaration get a function scope
      var heap = new MinHeap();
    } else if (h === "f") {
      var heap = new FibonacciHeap();
      // to keep track of node to make decrease key when distances get smaller
      var pointers = {};
    } else {
      // return false if an invalid heap was choosen
      return false;
    }
    let dequeues = 0;
    // objs to map key to distance and key to parents
    const distances = {};
    const parents = {};
    let smallest;
    parents[s] = null;
    let deacrease = false;
    for (let vertex in this.list) {
      if (vertex !== s) {
        distances[vertex] = Infinity;
      }
    }
    distances[s] = 0;
    if (h === `f`) pointers = heap.buildHeap(distances);
    // else heap.buildHeap(distances);
    heap.enqueue(s, 0);
    // while we have nodes to visite:
    while (!heap.isEmpty()) {
      smallest = heap.dequeue().key;
      //   console.log(`smallest: ${smallest}, dist: ${distances[smallest]}`);
      dequeues++;
      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbour in this.list[smallest]) {
          let nextNode = this.list[smallest][neighbour];
          // calculate Dijkstra's  Greedy Criterium
          let d = distances[smallest] + nextNode.weight;
          //   compare distance calculated with last distance storaged
          if (d < distances[nextNode.node]) {
            //   updating distances and parents
            distances[nextNode.node] = d;
            parents[nextNode.node] = smallest;
            // try to deacrease key
            if (h === "b") {
              // binary heap we just need the key of the node to be decreased
              deacrease = heap.decreaseKey(nextNode.node, d);
            } else {
              // @TODO Refactoring FH Decrease key
              //   console.log(`key pointer: ${pointers[nextNode.node].key}`);
              //FH we need a pointer to the node to be decreased
              deacrease = heap.decreaseKey(pointers[nextNode.node], d);
              // heap.enqueue(nextNode.node, d);
            }
            if (!deacrease) {
              // if this node is not in heap(wasn't decrease) add to the Heap
              if (h === "f") {
                pointers[nextNode.node] = heap.enqueue(nextNode.node, d);
              } else {
                heap.enqueue(nextNode.node, d);
              }
            } else {
              if (h === "f") {
                // console.log(deacrease);
                pointers[nextNode.node] = deacrease;
              }
            }
          }
        }
      }
    }
    console.log(
      `dequeues: ${dequeues},size: ${this.size}, h.size: ${heap.size}`
    );
    return { distances, parents };
  };

  // Returns the MST and its cost
  prim = (s) => {
    let heap = new MinHeap();
    // const heap = h === 'f' ? new FibonacciHeap() : new MinHeap();
    const mst = new Graph();
    // map to keep track what element is already in mst
    // we dont need this in Dijkstra because dist always encrease
    const mstSet = {};
    // objs to map key to edge cost and to parent
    const edgeCost = {};
    const parents = {};
    // sum of each MST's edge
    let cost = 0;
    let dequeues = 0;
    let smallest;
    let deacrease = false;
    for (let vertex in this.list) {
      if (vertex !== s) {
        edgeCost[vertex] = Infinity;
        mstSet[vertex] = false;
      }
    }
    edgeCost[s] = 0;
    heap.buildHeap(edgeCost);
    parents[s] = null;
    mstSet[s] = true;
    while (!heap.isEmpty()) {
      smallest = heap.dequeue().key;
      dequeues++;
      //   we found the min cost to add smallest in our MST
      cost += edgeCost[smallest];
      mst.addVertex(smallest);
      mstSet[smallest] = true;
      if (parents[smallest]) {
        //   if smallest has a parent (is not the start node) add the edge to mst
        mst.addEdge(smallest, parents[smallest], edgeCost[smallest]);
      }
      if (smallest || edgeCost[smallest] !== Infinity) {
        for (let neighbour in this.list[smallest]) {
          let nextNode = this.list[smallest][neighbour];
          // compare the cost of this edge with the last one storaged
          //   and check if this node is already in mstSet
          if (
            nextNode.weight < edgeCost[nextNode.node] &&
            !mstSet[nextNode.node]
          ) {
            //   updating edgeCost and parents
            edgeCost[nextNode.node] = nextNode.weight;
            parents[nextNode.node] = smallest;
            // try to deacrease key, if isConnect always will decrease
            deacrease = heap.decreaseKey(nextNode.node, nextNode.weight);
          }
        }
      }
    }
    console.log(
      `dequeues: ${dequeues}, size: ${this.size}, h.size: ${heap.size}`
    );
    return { cost, mst };
  };
}

export = Graph;
