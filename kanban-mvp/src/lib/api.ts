import { supabase } from './supabaseClient'

export async function getBoards() {
  const { data, error } = await supabase.from('boards').select('*').order('created_at')
  if (error) throw error
  return data
}

export async function getBoardColumns(boardId: string) {
  const { data, error } = await supabase
    .from('board_columns')
    .select('*')
    .eq('board_id', boardId)
    .order('order_index')
  if (error) throw error
  return data
}

export async function getItems(boardId: string) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('board_id', boardId)
    .order('order_index')
  if (error) throw error
  return data
}
