import { useState } from 'react'
import type { Filters } from '../../lib/filtering'

export default function FiltersBar({
  boardId,
  onChange,
}: {
  boardId: string
  onChange: (filters: Filters) => void
}) {
  const [sort, setSort] = useState<Filters['sort']>('created')
  const [highOnly, setHighOnly] = useState(false)

  return (
    <div className="filters-bar">
      <div className="filters-group">
        <span className="filters-title">Filtros</span>
        <label className="chip">
          <input
            type="checkbox"
            checked={highOnly}
            onChange={(event) => {
              setHighOnly(event.target.checked)
              onChange({ sort, priorities: event.target.checked ? ['high'] : [] })
            }}
          />
          Alta prioridade
        </label>
      </div>
      <div className="filters-group">
        <span className="filters-title">Ordenar</span>
        <div className="select">
          <select
            value={sort}
            onChange={(event) => {
              const next = event.target.value as Filters['sort']
              setSort(next)
              onChange({ sort: next, priorities: highOnly ? ['high'] : [] })
            }}
          >
            <option value="created">Data de criacao</option>
            <option value="due">Vencimento</option>
            <option value="priority">Prioridade</option>
            <option value="alpha">Alfabetica</option>
          </select>
        </div>
      </div>
      <div className="filters-hint">Board: {boardId}</div>
    </div>
  )
}
