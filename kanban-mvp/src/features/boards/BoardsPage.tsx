import BoardList from './BoardList'
import KanbanBoard from '../kanban/KanbanBoard'

const boards = [
  { id: 'b-1', name: 'MVP Supabase', description: 'Entrega rapida do MVP.' },
  { id: 'b-2', name: 'Produto 2026', description: 'Roadmap extendido.' },
  { id: 'b-3', name: 'Clientes', description: 'Follow-up de contas.' },
]

export default function BoardsPage() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true"></span>
          <div>
            <p className="brand-title">Kanban Atlas</p>
            <p className="brand-subtitle">Boards inteligentes por nivel</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="ghost">Novo board</button>
          <button className="primary">Criar tarefa</button>
          <div className="avatar" aria-label="Perfil">
            DD
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <BoardList boards={boards} activeId="b-1" />
        </aside>
        <main className="board">
          <KanbanBoard boardId="b-1" />
        </main>
      </div>
    </div>
  )
}
