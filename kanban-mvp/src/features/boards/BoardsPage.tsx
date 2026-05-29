import { useMemo, useState } from 'react'
import BoardList from './BoardList'
import KanbanBoard from '../kanban/KanbanBoard'
import BoardForm from './BoardForm'
import { useBoards } from '../../hooks/useBoards'
import { useAuth } from '../../auth/AuthProvider'
import AccountMenu from '../profile/AccountMenu'

export default function BoardsPage() {
  const { user } = useAuth()
  const {
    boards,
    loading,
    createBoard,
    updateBoard,
    deleteBoard,
  } = useBoards(user?.id ?? null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const activeBoard = useMemo(() => {
    if (!boards.length) return null
    return boards.find((board) => board.id === activeId) ?? boards[0]
  }, [boards, activeId])

  const handleCreate = async (data: { name: string; description?: string }) => {
    const created = await createBoard(data)
    if (created) {
      setActiveId(created.id)
      setShowCreate(false)
    }
  }

  const handleEdit = async (data: { name: string; description?: string }) => {
    if (!editingId) return
    await updateBoard(editingId, {
      name: data.name,
      description: data.description ?? null,
    })
    setEditingId(null)
  }

  const handleDelete = async (boardId: string) => {
    if (!confirm('Apagar este board e todos os itens?')) return
    await deleteBoard(boardId)
    if (activeId === boardId) {
      setActiveId(null)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true"></span>
            <div>
              <p className="brand-title">quina</p>
              <p className="brand-subtitle">Um canto para o seu trabalho.</p>
            </div>
        </div>
        <div className="header-actions">
          <button className="ghost" onClick={() => setShowCreate(true)}>
            Criar board
          </button>
          <AccountMenu />
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          {loading ? (
            <p>Carregando boards...</p>
          ) : (
            <BoardList
              boards={boards}
              activeId={activeBoard?.id ?? ''}
              onSelect={setActiveId}
              onEdit={setEditingId}
              onDelete={handleDelete}
              onCreate={() => setShowCreate(true)}
            />
          )}
          {showCreate ? (
            <BoardForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
          ) : null}
          {editingId ? (
            <BoardForm
              onSubmit={handleEdit}
              onCancel={() => setEditingId(null)}
              initialName={
                boards.find((board) => board.id === editingId)?.name ?? ''
              }
              initialDescription={
                boards.find((board) => board.id === editingId)?.description ?? ''
              }
            />
          ) : null}
        </aside>
        <main className="board">
          {activeBoard ? (
            <KanbanBoard boardId={activeBoard.id} />
          ) : (
            <div className="empty-state">
              Ainda nao ha nada aqui — comece pelo que mais pesa hoje.
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
