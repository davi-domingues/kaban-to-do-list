import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
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

type ChildFormData = {
  title: string
  description?: string
  columnId: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  tags: string[]
}

type TreeNode = {
  id: string
  title: string
  children: TreeNode[]
}

export default function KanbanColumn({
  column,
  filters,
  onEdit,
  onDelete,
  childrenTrees,
  onCreateChild,
}: {
  column: Column
  filters?: Filters
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  childrenTrees: Record<string, TreeNode[]>
  onCreateChild: (parentId: string, data: ChildFormData) => void
}) {
  const cards = filters ? applyFilters(column.cards, filters) : column.cards

  return (
    <section className="column">
      <header className="column-header">
        <h2>{column.name}</h2>
        <span className="column-count">{cards.length}</span>
      </header>
      <div className="column-body">
        <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onEdit={() => onEdit(card.id)}
              onDelete={() => onDelete(card.id)}
              childrenTree={childrenTrees[card.id] ?? []}
              onCreateChild={(data) => onCreateChild(card.id, data)}
            />
          ))}
        </SortableContext>
      </div>
    </section>
  )
}
