const Queue = require('./queue');
const Stack = require('./stack');

class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  //   **********************************************************
  //                            INSERT
  //   **********************************************************

  // Inserts a node in the right position and rearrange
  // Returns this BST
  // Returns false whether this val is already in this BST
  insert(val) {
    let node = new Node(val);
    // check if this BST is empty
    if (!this.root) {
      this.root = node;
      return this;
    }
    let current = this.root;
    while (current !== null) {
      // duplicate val
      if (current.val === node.val) return false;
      // check left
      if (current.val > node.val) {
        if (!current.left) {
          node.parent = current;
          current.left = node;
          return this;
        }
        // update current to left
        current = current.left;
        // check right
      } else {
        if (!current.right) {
          node.parent = current;
          current.right = node;
          return this;
        }
        // update current
        current = current.right;
      }
    }
  }

  //   **********************************************************
  //                            SEARCH
  //   **********************************************************

  // Returns true if this BST contains this val,
  // Otherwise returns false
  contains(val) {
    if (!this.root) return false;
    let current = this.root;
    while (current !== null) {
      // if we find return true
      if (current.val === val) return true;
      // check left
      if (current.val > val) {
        current = current.left;
      } else {
        // check right
        current = current.right;
      }
    }
    // if we didnt find return flase
    return false;
  }

  // Returns the min node from the subtree who has x as root
  min(x = this.root) {
    // returns false if this BST is empty
    if (!this.root) return false;
    while (x.left !== null) {
      x = x.left;
    }
    return x;
  }

  // Returns the max node from the subtree who has x as root
  max(x = this.root) {
    // returns false if this BST is empty
    if (!this.root) return false;
    while (x.right !== null) {
      x = x.right;
    }
    return x;
  }

  sucessor(x) {
    // check if there is a right subtree
    if (x.right !== null) {
      // sucessor is the leftmost node in this subtree
      return this.min(x.right);
    }
    // go up until we find a node who is the left child
    // its parent is the sucessor
    let y = x.parent;
    // while x is the right child (its parent y is smaller than x) we update
    while (y !== null && x === y.right) {
      x = y;
      y = y.parent;
    }
    return y;
  }

  predecessor(x) {
    // check if there is a left subtree
    if (x.left !== null) {
      // predecessor is the rightmost node in this subtree
      return this.max(x.left);
    }
    // go up until we find a node who is the right child
    // its parent is the predecessor
    let y = x.parent;
    // while x is the left child (its parent y is greater than x) we update
    while (y !== null && x === y.left) {
      x = y;
      y = y.parent;
    }
    return y;
  }

  //   **********************************************************
  //                        TRANSVERSING
  //   **********************************************************

  bfs() {
    if (!this.root) return undefined;
    let q = new Queue();
    let visited = [];
    let current;
    q.enQueue(this.root);
    while (q.size !== 0) {
      current = q.deQueue();
      visited.push(current.val);
      if (current.left) q.enQueue(current.left);
      if (current.right) q.enQueue(current.right);
    }
    return visited;
  }

  dfsPreOrder() {
    if (!this.root) return undefined;
    let stack = new Stack();
    let visited = [];
    let current;
    stack.push(this.root);
    while (stack.size !== 0) {
      current = stack.pop();
      visited.push(current.val);
      if (current.right) stack.push(current.right);
      if (current.left) stack.push(current.left);
    }
    return visited;
  }
}

module.exports = BST;
