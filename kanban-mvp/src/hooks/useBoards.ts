import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export type Board = {
  id: string
  name: string
  description: string | null
  owner_id: string
}

export function useBoards(userId: string | null) {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadBoards() {
      if (!userId) {
        setBoards([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at')

      if (!ignore) {
        if (error) {
          setBoards([])
        } else {
          setBoards(data ?? [])
        }
        setLoading(false)
      }
    }

    loadBoards()

    return () => {
      ignore = true
    }
  }, [userId])

  async function createBoard(input: { name: string; description?: string }) {
    if (!userId) return null

    const { data, error } = await supabase
      .from('boards')
      .insert({
        owner_id: userId,
        name: input.name,
        description: input.description ?? null,
      })
      .select('*')
      .single()

    if (!error && data) {
      setBoards((prev) => [...prev, data])
    }

    return data ?? null
  }

  async function updateBoard(boardId: string, updates: Partial<Board>) {
    const { data, error } = await supabase
      .from('boards')
      .update(updates)
      .eq('id', boardId)
      .select('*')
      .single()

    if (!error && data) {
      setBoards((prev) => prev.map((board) => (board.id === boardId ? data : board)))
    }

    return data ?? null
  }

  async function deleteBoard(boardId: string) {
    const { error } = await supabase.from('boards').delete().eq('id', boardId)
    if (!error) {
      setBoards((prev) => prev.filter((board) => board.id !== boardId))
    }
  }

  return {
    boards,
    loading,
    createBoard,
    updateBoard,
    deleteBoard,
  }
}
