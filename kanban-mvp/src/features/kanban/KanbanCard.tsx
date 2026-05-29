import { useState } from 'react'
import HierarchyTree from './HierarchyTree'

type Card = {
  id: string
  title: string
  priority: string
  due: string
  tags: string[]
  children: number
}

const demoTree = [
  {
    id: 't-1',
    title: 'Story: Auth com Supabase',
    children: [
      { id: 't-1-1', title: 'Task: Login email' },
      { id: 't-1-2', title: 'Task: OAuth Google' },
    ],
  },
]

export default function KanbanCard({ card }: { card: Card }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="card">
      <div className="card-header">
        <h3>{card.title}</h3>
        <span className={`priority ${card.priority.toLowerCase()}`}>
          {card.priority}
        </span>
      </div>
      <div className="card-tags">
        {card.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="card-meta">
        <span>Vence: {card.due}</span>
        <span>{card.children} filhos</span>
      </div>
      <button className="card-expand" onClick={() => setOpen(!open)}>
        {open ? 'Ocultar filhos' : 'Expandir filhos'}
      </button>
      {open ? <HierarchyTree nodes={demoTree} /> : null}
    </article>
  )
}
