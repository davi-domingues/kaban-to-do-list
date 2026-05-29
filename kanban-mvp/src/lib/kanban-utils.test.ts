import { describe, expect, it } from 'vitest'
import { buildItemTree, reorderIds } from './kanban-utils'

describe('reorderIds', () => {
  it('moves the active id before the over id', () => {
    // Arrange
    const ids = ['a', 'b', 'c', 'd']

    // Act
    const result = reorderIds(ids, 'd', 'b')

    // Assert
    expect(result).toEqual(['a', 'd', 'b', 'c'])
  })

  it('returns same list when ids are missing', () => {
    // Arrange
    const ids = ['a', 'b']

    // Act
    const result = reorderIds(ids, 'x', 'b')

    // Assert
    expect(result).toEqual(ids)
  })
})

describe('buildItemTree', () => {
  it('builds a nested tree from parent ids', () => {
    // Arrange
    const items = [
      { id: '1', parent_id: null, title: 'Epic' },
      { id: '2', parent_id: '1', title: 'Story' },
      { id: '3', parent_id: '2', title: 'Task' },
    ]

    // Act
    const result = buildItemTree(items, '1')

    // Assert
    expect(result).toEqual([
      {
        id: '2',
        title: 'Story',
        children: [{ id: '3', title: 'Task', children: [] }],
      },
    ])
  })

  it('returns empty array when parent has no children', () => {
    // Arrange
    const items = [
      { id: '1', parent_id: null, title: 'Epic' },
      { id: '2', parent_id: '1', title: 'Story' },
    ]

    // Act
    const result = buildItemTree(items, '999')

    // Assert
    expect(result).toEqual([])
  })
})
