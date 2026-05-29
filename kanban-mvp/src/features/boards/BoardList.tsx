type Board = {
  id: string
  name: string
  description?: string
}

export default function BoardList({
  boards,
  activeId,
}: {
  boards: Board[]
  activeId: string
}) {
  return (
    <div>
      <div className="sidebar-section">
        <p className="sidebar-title">Boards</p>
        {boards.map((board) => (
          <button
            className={`sidebar-item ${board.id === activeId ? 'active' : ''}`}
            key={board.id}
          >
            <span>{board.name}</span>
            {board.description ? (
              <small className="sidebar-muted">{board.description}</small>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}
