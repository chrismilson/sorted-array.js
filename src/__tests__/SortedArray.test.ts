import { SortedArray } from '..'

describe('SortedSet', () => {
  describe('get', () => {
    it('Should return undefined for invalid indicies', () => {
      const arr = new SortedArray<number>((a, b) => a - b)

      arr.insert(1)
      arr.insert(5)

      expect(arr.get(6)).toBe(undefined)
      expect(arr.get(-10)).toBe(undefined)
      expect(arr.get(NaN)).toBe(undefined)
      expect(arr.get(Infinity)).toBe(undefined)
      expect(arr.get(arr.length)).toBe(undefined)
    })

    it('Should return the value at the given index', () => {
      const values = [1, 1, 1, 2, 2, 4, 4, 4, 6, 6, 6, 6, 6]
      const arr = new SortedArray<number>((a, b) => a - b)

      for (const v of values) {
        arr.insert(v)
      }

      expect(arr.get(3)).toBe(values[3])
      expect(arr.get(8)).toBe(values[8])
    })
  })

  describe('length', () => {
    it('Should return the number of values in the tree', () => {
      const arr = new SortedArray<number>((a, b) => a - b)

      expect(arr.length).toBe(0)

      arr.insert(1)
      arr.insert(2)
      arr.insert(5)

      expect(arr.length).toBe(3)

      arr.insert(1)

      expect(arr.length).toBe(4)
    })
  })

  describe('iterator', () => {
    it('Should iterate the right values and in order', () => {
      const arr = new SortedArray<number>((a, b) => a - b)
      arr.insert(2)
      arr.insert(1)
      arr.insert(3)
      arr.insert(1)
      const it = arr[Symbol.iterator]()

      expect(it.next().value).toBe(1)
      expect(it.next().value).toBe(1)
      expect(it.next().value).toBe(2)
      expect(it.next().value).toBe(3)
      expect(it.next().done).toBeTruthy()
    })
  })

  describe('insert', () => {
    it('Should insert values in order', () => {
      const arr = new SortedArray<number>((a, b) => a - b)

      arr.insert(1)
      arr.insert(5)

      expect([...arr]).toMatchObject([1, 5])

      arr.insert(2)

      expect([...arr]).toMatchObject([1, 2, 5])
    })
  })

  describe('remove', () => {
    it('Should remove a value from a tree.', () => {
      const s = new SortedArray<number>((a, b) => a - b)
      const vals = []
      for (let i = 0; i < 10; i++) {
        s.insert(i).insert(i)
        vals.push(i, i)
      }

      expect([...s]).toMatchObject(vals)
      vals.splice(3, 1)
      s.pop(3)
      expect([...s]).toMatchObject(vals)
      vals.splice(3, 1)
      s.pop(3)
      expect([...s]).toMatchObject(vals)
    })
  })
})
