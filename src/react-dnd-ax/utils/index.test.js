import { moveItem } from './index'

describe('moveItem', () => {
  it('should return the correct array when targetPosition equals to sourceIndex', () => {
    const before = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]
    const after = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]
    expect(moveItem(before, 1, 1)).toEqual(after)
  })

  it('should return the correct array when targetPosition is less than sourceIndex', () => {
    const before = [{id: 1}, {id: 2}, {id: 3}, {id: 4, children: [1, 2, 4]}, {id: 5}]
    const after = [{id: 1}, {children: [1, 2, 4], id: 4}, {id: 2}, {id: 3}, {id: 5}]
    expect(moveItem(before, 1, 3)).toEqual(after)
  })

  it('should return the correct array when targetPosition is bigger than sourceIndex', () => {
    const before = [{id: 1}, {id: 2, name: 'foo'}, {id: 3}, {id: 4}, {id: 5}]
    const after = [{id: 1}, {id: 3}, {id: 2, name: 'foo'}, {id: 4}, {id: 5}]
    expect(moveItem(before, 3, 1)).toEqual(after)
  })
})
