import KanbanCard from './KanbanCard'
import { applyFilters } from '../../lib/filtering'
import type { Filters } from '../../lib/filtering'

type Card = {
  id: string
  title: string
  priority: string
  due: string
  tags: string[]
  children: number
}

type Column = {
  id: string
  name: string
  cards: Card[]
}

export default function KanbanColumn({
  column,
  filters,
}: {
  column: Column
  filters?: Filters
}) {
  const cards = filters ? applyFilters(column.cards, filters) : column.cards

  return (
    <section className="column">
      <header className="column-header">
        <h2>{column.name}</h2>
        <span className="column-count">{cards.length}</span>
      </header>
      <div className="column-body">
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}
