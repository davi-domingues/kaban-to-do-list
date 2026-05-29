type Board = {
  id: string
  name: string
  description?: string | null
}

export default function BoardList({
  boards,
  activeId,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}: {
  boards: Board[]
  activeId: string
  onSelect: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onCreate: () => void
}) {
  return (
    <div>
      <div className="sidebar-section">
        <p className="sidebar-title">Boards</p>
        {boards.map((board) => (
          <button
            className={`sidebar-item ${board.id === activeId ? 'active' : ''}`}
            key={board.id}
            onClick={() => onSelect(board.id)}
          >
            <span>{board.name}</span>
            {board.description ? (
              <small className="sidebar-muted">{board.description}</small>
            ) : null}
            <div className="board-actions">
              <button
                type="button"
                className="mini"
                onClick={(event) => {
                  event.stopPropagation()
                  onEdit(board.id)
                }}
              >
                Editar
              </button>
              <button
                type="button"
                className="mini danger"
                onClick={(event) => {
                  event.stopPropagation()
                  onDelete(board.id)
                }}
              >
                Apagar
              </button>
            </div>
          </button>
        ))}
        <button type="button" className="ghost" onClick={onCreate}>
          + Novo board
        </button>
      </div>
    </div>
  )
}
