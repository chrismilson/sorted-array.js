import { balanceLeft, balanceRight, SATNode } from '../tree'

describe('balance', () => {
  // All trees represent [ 1, 1, 1, 2, 2, 2, 3, 3, 3, 3 ]
  const balanced: SATNode<number> = {
    data: { value: 2, valueCount: 10, size: 3 },
    left: {
      data: { value: 1, valueCount: 3, size: 1 },
    },
    right: {
      data: { value: 3, valueCount: 4, size: 1 },
    },
  }
  const rightHeavy: SATNode<number> = {
    data: { value: 1, valueCount: 10, size: 3 },
    right: {
      data: { value: 2, valueCount: 7, size: 2 },
      right: {
        data: { value: 3, valueCount: 4, size: 1 },
      },
    },
  }
  const leftHeavy: SATNode<number> = {
    data: { value: 3, valueCount: 10, size: 3 },
    left: {
      data: { value: 2, valueCount: 6, size: 2 },
      left: {
        data: { value: 1, valueCount: 3, size: 1 },
      },
    },
  }

  test('The balanced tree is balanced', () => {
    expect(balanceLeft(balanced)).toBe(balanced)
    expect(balanceRight(balanced)).toBe(balanced)
  })

  it('Should update the valueCount attribute when rotating left', () => {
    expect(balanceLeft(rightHeavy)).toMatchObject(balanced)
  })

  it('Should update the valueCount attribute when rotating right', () => {
    expect(balanceRight(leftHeavy)).toMatchObject(balanced)
  })
})
