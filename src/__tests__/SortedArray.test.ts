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
      arr.insert(3)
      arr.insert(1)
      const it = arr[Symbol.iterator]()

      for (let i = 1; i < 4; i++) {
        expect(it.next().value).toBe(i)
      }
      expect(it.next().done).toBeTruthy()
    })
  })

  describe('add', () => {
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
        s.insert(i)
        vals.push(i)
      }

      expect([...s]).toMatchObject(vals)
      vals.splice(3, 1)
      s.pop(3)
      expect([...s]).toMatchObject(vals)
    })
  })
})
