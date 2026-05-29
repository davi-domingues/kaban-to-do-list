import type { Filters } from '../../lib/filtering'

export default function FiltersBar({
  boardId,
  onChange,
}: {
  boardId: string
  onChange: (filters: Filters) => void
}) {
  return (
    <div className="filters-bar">
      <div className="filters-group">
        <span className="filters-title">Filtros</span>
        <label className="chip">
          <input type="checkbox" /> Etiqueta
        </label>
        <label className="chip">
          <input type="checkbox" /> Status
        </label>
        <label className="chip">
          <input type="checkbox" /> Prioridade
        </label>
        <label className="chip">
          <input type="checkbox" /> Vencimento
        </label>
      </div>
      <div className="filters-group">
        <span className="filters-title">Ordenar</span>
        <div className="select">
          <select
            defaultValue="created"
            onChange={(event) =>
              onChange({ sort: event.target.value as Filters['sort'] })
            }
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
