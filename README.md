# Sorted Array

Sometimes you have an array that needs to be kept in order through pushes and
pops etc.

```js
// Becomes slow as arrays get larger. O(n log n)
arr.push(value)
arr.sort()

// May check all values; not binary search.
arr.indexOf(value)
```

This module provides an API similar to the builtin javascript `Array`, but
remains sorted after insertion and deletion.

```js
const arr = new SortedArray((a, b) => a - b)

// Each insert runs in O(log n)
arr.insert(5) // [ 5 ]
arr.insert(10) // [ 5 10 ]
arr.insert(1) // [ 1 5 10 ]
arr.insert(5) // [ 1 5 5 10 ]

arr.forEach((v) => console.log(v)) // 1 5 5 10
```

## Usage

Check out [the docs](http://shlappas.com/sorted-array.js)!

## Installation

```bash
yarn add @shlappas/sorted-array
```

## See Also

This modules is very similar to
[`sorted-set`](https://github.com/chrismilson/sorted-set.js). (both use a
weight-balanced tree in the background)