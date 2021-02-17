import { insert, find, SATNode, remove } from './tree'
import { enumerate, range, repeat } from '@shlappas/itertools'

/**
 * The default comparison function. Designed to be consistend with
 * `Array.prototype.sort()`.`
 */
export function defaultCmp(a: unknown, b: unknown): number {
  const aStr = new String(a)
  const bStr = new String(b)
  return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
}

/**
 * A sorted array. Stays sorted through insertion and deletion.
 */
export class SortedArray<T> {
  private root?: SATNode<T>
  private compare: (a: T, b: T) => number;
  [Symbol.toStringTag] = 'SortedArray'

  /**
   * Constructs a new Sorted Array.
   *
   * @param compare The comparison function for the sorting. Compares two
   * elements a and b. If a is less than b, returns a negative number. If a is
   * greater than b returns a positive number. If a is equal to b returns zero.
   */
  constructor(compare: (a: T, b: T) => number = defaultCmp) {
    this.compare = compare
  }

  private findAtIndex(
    idx: number,
    callback?: (node: SATNode<T>) => void
  ): SATNode<T> | undefined {
    return find(this.root, (node) => {
      // The number of indicies less than the current node
      const ltSize = node.left?.data.valueCount ?? 0
      // The number of indicies less than or equal to the current node
      const leSize = node.data.valueCount - (node.right?.data.valueCount ?? 0)

      if (callback !== undefined) {
        callback(node)
      }

      if (idx < ltSize) {
        // The index is in the left subtree
        return -1
      } else if (idx >= leSize) {
        // the index is in the right subtree
        idx -= leSize
        return 1
      }
      return 0
    })
  }

  /**
   * Removes the last value from the array and returns it. Optionally an index
   * to pop from can be specified.
   *
   * @param index The target index to pop from the array. Defaults to the last
   * element in the array. Must be within [0, arr.length)
   */
  pop(index?: number): T | undefined {
    if (this.root === undefined) {
      return undefined
    }
    // We want to remove the rightmost node from the tree.

    const targetIndex = index ?? this.root.data.valueCount - 1
    if (targetIndex < 0 || targetIndex >= this.length) {
      return undefined
    }

    // The index is good, so we will definitely find a node.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const target = this.findAtIndex(targetIndex, (node) => {
      node.data.valueCount -= 1
    })!
    // The value that we are popping from the tree
    const result = target.data.value

    if (target.data.valueCount === 0) {
      // We should delete the entire node.
      this.root = remove(result, this.root, this.compare)
    }

    return result
  }

  /**
   * Inserts a value into the sorted array in sorted order.
   *
   * Note that if the comparison function returns zero on a value already in the
   * array, the inserted value will be "absorbed" into that value.
   *
   * For example:
   *
   * ```ts
   * const arr = SortedArray((a, b) => 0)
   *
   * arr.insert(5) // [ 5 ]
   * arr.insert(1000) // [ 5, 5 ]
   * ```
   *
   * The comparator returned 0 when called on 5 and 1000, so the 1000 value was
   * absorbed into the value 5.
   */
  insert(value: T): this {
    const node = find(this.root, (node) => {
      node.data.valueCount += 1
      return this.compare(value, node.data.value)
    })

    if (node === undefined) {
      this.root = insert(value, this.root, this.compare)
    }

    return this
  }

  private indexRange(value: T): [number, number] {
    let left = 0
    let right = 0

    find(this.root, (node) => {
      const next = this.compare(value, node.data.value)

      if (next >= 0) {
        right += node.data.valueCount - (node.right?.data.valueCount ?? 0)
      }
      if (next > 0) {
        left += node.data.valueCount - (node.right?.data.valueCount ?? 0)
      }

      return next
    })

    return [left, right]
  }

  /**
   * Returns the largest index that the value could be inserted into.
   *
   * That is, `i`, such that for the sorted array `arr`, if `j` < `i`, `arr[j]`
   * ≤ `value` and if `j` ≥ `i`, `arr[j]` > `value`.
   */
  bisectRight(value: T): number {
    return this.indexRange(value)[1]
  }

  /**
   * Similar to [[bisectRight]], but returns the smallest index that the value
   * could be inserted to.
   */
  bisectLeft(value: T): number {
    return this.indexRange(value)[0]
  }

  /**
   * Returns the first index at which a given element can be found in the array,
   * or -1 if it is not present.
   *
   * @param value The value to locate in the array.
   * @param fromIdx The index to start the search at. If the index is greater
   * than or equal to the array's length, -1 is returned, which means the array
   * will not be searched. If the provided index value is a negative number, it
   * is taken as the offset from the end of the array. Note: if the provided
   * index is negative, the array is still searched from front to back. If the
   * provided index is 0, then the whole array will be searched. Default: 0
   * (entire array is searched).
   * @returns The first index of the element in the array; -1 if not found.
   */
  indexOf(value: T, fromIdx = 0): number {
    if (fromIdx >= this.length) {
      return -1
    }

    const [start, end] = this.indexRange(value)

    if (fromIdx <= start) {
      return start
    }
    if (fromIdx < end) {
      return fromIdx
    }
    return -1
  }

  /**
   * Returns the last index at which a given element can be found in the array,
   * or -1 if it is not present. The array is searched backwards, starting at
   * fromIndex.
   *
   * @param value The value to locate in the array.
   * @param fromIndex The index at which to start searching backwards. Defaults
   * to the array's length minus one (arr.length - 1), i.e. the whole array will
   * be searched. If the index is greater than or equal to the length of the
   * array, the whole array will be searched. If negative, it is taken as the
   * offset from the end of the array. Note that even when the index is
   * negative, the array is still searched from back to front. If the calculated
   * index is less than 0, -1 is returned, i.e. the array will not be searched.
   * @returns The last index of the element in the array; -1 if not found.
   */
  lastIndexOf(value: T, fromIndex = -1): number {
    if (fromIndex < 0) {
      if (fromIndex < -this.length) {
        return -1
      }
      fromIndex += this.length
    }
    const [start, end] = this.indexRange(value)
    if (fromIndex >= end) {
      return end - 1
    }
    if (fromIndex >= start) {
      return fromIndex
    }
    return -1
  }

  /**
   * Executes a provided function once for each array element.
   *
   * @param callbackfn The function to execute on each element.
   * @param thisArg The value to use as this when executing callback.
   */
  forEach(
    callbackfn: (value: T, index: number, array: this) => void,
    thisArg?: unknown
  ): void {
    callbackfn = callbackfn.bind(thisArg)

    for (const [i, val] of enumerate(this)) {
      callbackfn(val, i, this)
    }
  }

  entries(): IterableIterator<[number, T]> {
    return enumerate(this)
  }
  keys(): IterableIterator<number> {
    return range(this.root?.data.valueCount ?? 0)
  }
  values(): IterableIterator<T> {
    return this[Symbol.iterator]()
  }

  /**
   * Returns the value at the given index in the sorted order. (0-indexed)
   *
   * If the index is invalid, returns undefined.
   *
   * @param idx The index to lookup
   */
  get(idx: number): T | undefined {
    // Make sure we have a valid index
    if (idx < 0 || idx >= (this.root?.data.valueCount ?? 0) || isNaN(idx)) {
      return undefined
    }

    return this.findAtIndex(idx)?.data.value
  }

  /**
   * The number of distinct elements in the set.
   */
  get length(): number {
    return this.root?.data.valueCount ?? 0
  }

  /**
   * Iterates over the values in the set in sorted order.
   */
  *[Symbol.iterator](): Generator<T> {
    // Performs a morris traversal of the tree.
    let curr = this.root

    const valuesFrom = function* (node: SATNode<T>): Generator<T> {
      const lCount = node.left?.data.valueCount ?? 0
      // The right child may be an ancestor, due to the morris traversal.
      // If so the count will be greater than the nodes count.
      const rCount =
        node.right && node.right.data.valueCount <= node.data.valueCount
          ? node.right.data.valueCount
          : 0
      const count = node.data.valueCount - (lCount + rCount)

      yield* repeat(node.data.value, count)
    }

    while (curr) {
      if (!curr.left) {
        yield* valuesFrom(curr)
        curr = curr.right
      } else {
        let pre = curr.left
        while (pre.right && pre.right !== curr) {
          pre = pre.right
        }

        if (!pre.right) {
          pre.right = curr
          curr = curr.left
        } else {
          pre.right = undefined
          yield* valuesFrom(curr)
          curr = curr.right
        }
      }
    }
  }

  /**
   * Creates a sorted array from an iterable.
   *
   * @param iterable The itereable to turn into a sorted array.
   * @param compare The compare method for the resulting SortedArray.
   * @returns A new sorted array whose elements are from the passed iterable.
   */
  static from<T>(
    iterable: Iterable<T>,
    compare?: (a: T, b: T) => number
  ): SortedArray<T> {
    const result = new SortedArray<T>(compare)

    for (const value of iterable) {
      result.insert(value)
    }

    return result
  }
}
