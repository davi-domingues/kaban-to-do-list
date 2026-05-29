import { useState } from 'react'
import KanbanColumn from './KanbanColumn'
import FiltersBar from '../filters/FiltersBar'
import type { Filters } from '../../lib/filtering'

const columns = [
  {
    id: 'pendente',
    name: 'Pendente',
    cards: [
      {
        id: 'c-1',
        title: 'Planejar MVP com Supabase',
        priority: 'Alta',
        due: 'Hoje',
        tags: ['produto', 'backend'],
        children: 2,
      },
      {
        id: 'c-2',
        title: 'Criar estrutura de boards',
        priority: 'Media',
        due: 'Amanha',
        tags: ['ui'],
        children: 0,
      },
    ],
  },
  {
    id: 'progresso',
    name: 'Em progresso',
    cards: [
      {
        id: 'c-3',
        title: 'Desenhar hierarquia de tarefas',
        priority: 'Alta',
        due: 'Sex',
        tags: ['ux', 'modelo'],
        children: 3,
      },
    ],
  },
  {
    id: 'concluido',
    name: 'Concluido',
    cards: [
      {
        id: 'c-4',
        title: 'Definir colunas default',
        priority: 'Baixa',
        due: 'Ontem',
        tags: ['produto'],
        children: 0,
      },
    ],
  },
]

export default function KanbanBoard({ boardId }: { boardId: string }) {
  const [filters, setFilters] = useState<Filters>({ sort: 'created' })

  return (
    <div className="board">
      <div className="board-header">
        <div>
          <h1>MVP Supabase</h1>
          <p>Organize epicos, stories e tasks em qualquer nivel.</p>
        </div>
        <div className="board-meta">
          <span className="pill">Sem colaboracao</span>
          <span className="pill">3 colunas</span>
          <span className="pill">12 itens</span>
        </div>
      </div>

      <FiltersBar boardId={boardId} onChange={setFilters} />

      <div className="columns">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} filters={filters} />
        ))}
      </div>
    </div>
  )
}
