import { useMemo, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import KanbanColumn from './KanbanColumn'
import FiltersBar from '../filters/FiltersBar'
import type { Filters } from '../../lib/filtering'
import { useKanbanData } from '../../hooks/useKanbanData'
import BoardItemForm from './BoardItemForm'
import { buildItemTree, reorderIds } from '../../lib/kanban-utils'

export default function KanbanBoard({ boardId }: { boardId: string }) {
  const [filters, setFilters] = useState<Filters>({ sort: 'created', priorities: [] })
  const [showCreate, setShowCreate] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)
  const {
    columns,
    items,
    itemTags,
    loading,
    createItem,
    createChildItem,
    moveItemBatch,
    reorderColumnItems,
    updateItem,
    deleteItem,
  } = useKanbanData(boardId)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const columnsWithCards = useMemo(() => {
    return columns.map((column) => {
      const cards = items
        .filter((item) => item.column_id === column.id && !item.parent_id)
        .sort((a, b) => a.order_index - b.order_index)
        .map((item) => ({
          id: item.id,
          title: item.title,
          priority: item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Media' : 'Baixa',
          due: item.due_date ?? 'Sem data',
          tags: itemTags[item.id] ?? [],
          children: items.filter((child) => child.parent_id === item.id).length,
        }))

      return { ...column, cards }
    })
  }, [columns, items, itemTags])

  const columnsById = useMemo(() => {
    return columnsWithCards.reduce<Record<string, (typeof columnsWithCards)[number]>>(
      (acc, column) => {
        acc[column.id] = column
        return acc
      },
      {}
    )
  }, [columnsWithCards])

  const childrenTrees = useMemo(() => {
    const map: Record<string, ReturnType<typeof buildItemTree>> = {}
    const parents = items.filter((item) => item.parent_id !== null)
    const uniqueParentIds = [...new Set(parents.map((item) => item.parent_id!))]
    for (const parentId of uniqueParentIds) {
      map[parentId] = buildItemTree(items, parentId)
    }
    return map
  }, [items])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = String(active.id)
    const overId = String(over.id)

    const activeItem = items.find((item) => item.id === activeId)
    const overItem = items.find((item) => item.id === overId)
    if (!activeItem || !overItem) return

    const sourceColumn = activeItem.column_id
    const targetColumn = overItem.column_id
    if (!sourceColumn || !targetColumn) return

    if (sourceColumn === targetColumn) {
      const column = columnsById[sourceColumn]
      if (!column) return
      const ordered = reorderIds(column.cards.map((card) => card.id), activeId, overId)
      await reorderColumnItems(sourceColumn, ordered)
      return
    }

    const targetCards = columnsById[targetColumn]?.cards ?? []
    const ordered = reorderIds(targetCards.map((card) => card.id), activeId, overId)
    await moveItemBatch(activeId, targetColumn, ordered.indexOf(activeId), ordered)
  }

  return (
    <div className="board">
      <div className="board-header">
        <div>
          <h1>Kanban principal</h1>
          <p>Organizar com calma. Entregar com forca.</p>
        </div>
        <div className="board-meta">
          <span className="pill">Sem colaboracao</span>
          <span className="pill">{columns.length} colunas</span>
          <span className="pill">{items.length} itens</span>
          <button
            className="primary"
            onClick={() => {
              setSelectedColumn(columns[0]?.id ?? null)
              setShowCreate(true)
            }}
          >
            Criar tarefa
          </button>
        </div>
      </div>

      <FiltersBar boardId={boardId} onChange={setFilters} />

      {showCreate && selectedColumn ? (
        <BoardItemForm
          columnId={selectedColumn}
          onCancel={() => setShowCreate(false)}
          onSubmit={async (data) => {
            await createItem({
              title: data.title,
              description: data.description,
              columnId: data.columnId,
              priority: data.priority,
              dueDate: data.dueDate,
              tags: data.tags,
              parentId: null,
            })
            setShowCreate(false)
          }}
          columns={columns}
        />
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="columns">
          {loading ? (
            <div className="empty-state">Carregando colunas...</div>
          ) : (
            columnsWithCards.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              filters={filters}
              onEdit={setEditingItemId}
              onDelete={deleteItem}
              childrenTrees={childrenTrees}
              onCreateChild={async (parentId, data) => {
                await createChildItem(parentId, {
                  title: data.title,
                  description: data.description,
                  columnId: data.columnId,
                  priority: data.priority,
                  dueDate: data.dueDate,
                  tags: data.tags,
                })
              }}
            />
          ))
        )}
      </div>
    </DndContext>
      {editingItemId ? (
        <BoardItemForm
          columnId={items.find((item) => item.id === editingItemId)?.column_id ?? columns[0]?.id ?? ''}
          columns={columns}
          onCancel={() => setEditingItemId(null)}
          onSubmit={async (data) => {
            await updateItem(editingItemId, {
              title: data.title,
              description: data.description ?? null,
              column_id: data.columnId,
              priority: data.priority,
              due_date: data.dueDate ?? null,
            })
            setEditingItemId(null)
          }}
          initialTitle={items.find((item) => item.id === editingItemId)?.title ?? ''}
          initialDescription={
            items.find((item) => item.id === editingItemId)?.description ?? ''
          }
          initialPriority={items.find((item) => item.id === editingItemId)?.priority ?? 'medium'}
          initialDueDate={items.find((item) => item.id === editingItemId)?.due_date ?? ''}
          initialTags={(itemTags[editingItemId] ?? []).join(', ')}
        />
      ) : null}
    </div>
  )
}
