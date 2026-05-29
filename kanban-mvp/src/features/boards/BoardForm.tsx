import { useState } from 'react'

export default function BoardForm({
  onSubmit,
  initialName = '',
  initialDescription = '',
  onCancel,
}: {
  onSubmit: (data: { name: string; description?: string }) => void
  initialName?: string
  initialDescription?: string
  onCancel: () => void
}) {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)

  return (
    <form
      className="board-form"
      onSubmit={(event) => {
        event.preventDefault()
        if (!name.trim()) return
        onSubmit({ name: name.trim(), description: description.trim() || undefined })
      }}
    >
      <label>
        Nome do board
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Descricao
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
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
