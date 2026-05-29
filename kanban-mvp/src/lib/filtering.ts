type Card = {
  id: string
  title: string
  priority: string
  due: string
  tags: string[]
  children: number
}

export type Filters = {
  tags?: string[]
  status?: string[]
  priorities?: string[]
  due?: string
  sort?: 'created' | 'due' | 'priority' | 'alpha'
}

export function applyFilters(cards: Card[], filters: Filters) {
  let output = [...cards]

  if (filters.tags?.length) {
    output = output.filter((card) =>
      card.tags.some((tag) => filters.tags?.includes(tag))
    )
  }

  if (filters.priorities?.length) {
    output = output.filter((card) =>
      filters.priorities?.includes(card.priority.toLowerCase())
    )
  }

  if (filters.sort) {
    output.sort((a, b) => {
      if (filters.sort === 'alpha') {
        return a.title.localeCompare(b.title)
      }
      if (filters.sort === 'priority') {
        const rank = { alta: 1, media: 2, baixa: 3 } as Record<string, number>
        return (rank[a.priority.toLowerCase()] ?? 9) - (rank[b.priority.toLowerCase()] ?? 9)
      }
      return 0
    })
  }

  return output
}
