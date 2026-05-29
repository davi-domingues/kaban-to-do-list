import { useState } from 'react'
import type { Column } from '../../hooks/useKanbanData'

export default function BoardItemForm({
  columns,
  columnId,
  onSubmit,
  onCancel,
  initialTitle = '',
  initialDescription = '',
  initialPriority = 'medium',
  initialDueDate = '',
  initialTags = '',
}: {
  columns: Column[]
  columnId: string
  onSubmit: (data: {
    title: string
    description?: string
    columnId: string
    priority: 'low' | 'medium' | 'high'
    dueDate?: string
    tags: string[]
  }) => void
  onCancel: () => void
  initialTitle?: string
  initialDescription?: string
  initialPriority?: 'low' | 'medium' | 'high'
  initialDueDate?: string
  initialTags?: string
}) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    initialPriority
  )
  const [dueDate, setDueDate] = useState(initialDueDate)
  const [tags, setTags] = useState(initialTags)
  const [selectedColumn, setSelectedColumn] = useState(columnId)

  return (
    <form
      className="board-form"
      onSubmit={(event) => {
        event.preventDefault()
        if (!title.trim()) return
        onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
          columnId: selectedColumn,
          priority,
          dueDate: dueDate || undefined,
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        })
      }}
    >
      <label>
        Titulo
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label>
        Descricao
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <label>
        Coluna
        <select value={selectedColumn} onChange={(event) => setSelectedColumn(event.target.value)}>
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Prioridade
        <select value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)}>
          <option value="low">Baixa</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </label>
      <label>
        Vencimento
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
      </label>
      <label>
        Tags (separadas por virgula)
        <input value={tags} onChange={(event) => setTags(event.target.value)} />
      </label>
      <div className="board-form-actions">
        <button type="button" className="ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="primary">
          Salvar
        </button>
      </div>
    </form>
  )
}
