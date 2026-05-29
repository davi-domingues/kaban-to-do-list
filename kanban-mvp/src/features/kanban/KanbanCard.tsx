import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import HierarchyTree from './HierarchyTree'

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

type Card = {
  id: string
  title: string
  priority: string
  due: string
  tags: string[]
  children: number
}

export default function KanbanCard({
  card,
  onEdit,
  onDelete,
  childrenTree,
  onCreateChild,
}: {
  card: Card
  onEdit: () => void
  onDelete: () => void
  childrenTree: TreeNode[]
  onCreateChild: (data: ChildFormData) => void
}) {
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [showChildForm, setShowChildForm] = useState(false)
  const [childTitle, setChildTitle] = useState('')
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  const handleAddChild = () => {
    if (!childTitle.trim()) return
    onCreateChild({
      title: childTitle.trim(),
      columnId: card.id,
      priority: 'medium',
      tags: [],
    })
    setChildTitle('')
    setShowChildForm(false)
  }

  return (
    <article className={`card ${isDragging ? 'dragging' : ''}`} ref={setNodeRef} style={style}>
      <div className="card-header">
        <div className="card-title" {...attributes} {...listeners}>
          <button
            className={`check-button ${checked ? 'checked' : ''}`}
            type="button"
            onClick={() => setChecked(!checked)}
            aria-label="Marcar como concluido"
          >
            {checked ? '✓' : ''}
          </button>
          <h3>{card.title}</h3>
        </div>
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
      <div className="card-actions">
        <button className="mini" type="button" onClick={onEdit}>
          Editar
        </button>
        <button className="mini danger" type="button" onClick={onDelete}>
          Apagar
        </button>
      </div>
      <button className="card-expand" onClick={() => {
        setOpen(!open)
        if (!open && childrenTree.length === 0) {
          setShowChildForm(true)
        }
      }}>
        {open ? 'Ocultar filhos' : 'Expandir filhos'}
      </button>
      {open ? (
        <div className="card-children">
          <HierarchyTree nodes={childrenTree} />
          {showChildForm ? (
            <div className="child-form">
              <input
                value={childTitle}
                onChange={(event) => setChildTitle(event.target.value)}
                placeholder="Titulo do filho"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleAddChild()
                }}
              />
              <button type="button" className="mini" onClick={handleAddChild}>
                Adicionar
              </button>
              <button
                type="button"
                className="mini danger"
                onClick={() => setShowChildForm(false)}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="mini"
              onClick={() => setShowChildForm(true)}
            >
              + Adicionar filho
            </button>
          )}
        </div>
      ) : null}
    </article>
  )
}
