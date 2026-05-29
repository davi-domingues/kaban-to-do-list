import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export type Column = {
  id: string
  board_id: string
  name: string
  order_index: number
}

export type Item = {
  id: string
  board_id: string
  column_id: string | null
  parent_id: string | null
  title: string
  description: string | null
  status: string
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  created_at: string
  completed_at: string | null
  order_index: number
}

export type Tag = {
  id: string
  board_id: string
  name: string
  color: string | null
}

export function useKanbanData(boardId: string | null) {
  const [columns, setColumns] = useState<Column[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [itemTags, setItemTags] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadData() {
      if (!boardId) {
        setColumns([])
        setItems([])
        setTags([])
        setItemTags({})
        setLoading(false)
        return
      }

      const [columnsRes, itemsRes, tagsRes] = await Promise.all([
        supabase
          .from('board_columns')
          .select('*')
          .eq('board_id', boardId)
          .order('order_index'),
        supabase.from('items').select('*').eq('board_id', boardId).order('order_index'),
        supabase.from('tags').select('*').eq('board_id', boardId).order('name'),
      ])

      const tagsMap: Record<string, string> = {}
      tagsRes.data?.forEach((tag) => {
        tagsMap[tag.id] = tag.name
      })

      let itemTagsMap: Record<string, string[]> = {}
      if (itemsRes.data && itemsRes.data.length) {
        const { data: linkData } = await supabase
          .from('item_tags')
          .select('item_id, tag_id')
          .in(
            'item_id',
            itemsRes.data.map((item) => item.id)
          )

        itemTagsMap = (linkData ?? []).reduce<Record<string, string[]>>(
          (acc, link) => {
            const name = tagsMap[link.tag_id]
            if (!name) return acc
            acc[link.item_id] = [...(acc[link.item_id] ?? []), name]
            return acc
          },
          {}
        )
      }

      if (!ignore) {
        setColumns(columnsRes.data ?? [])
        setItems(itemsRes.data ?? [])
        setTags(tagsRes.data ?? [])
        setItemTags(itemTagsMap)
        setLoading(false)
      }
    }

    loadData()

    return () => {
      ignore = true
    }
  }, [boardId])

  const columnsById = useMemo(() => {
    return columns.reduce<Record<string, Column>>((acc, column) => {
      acc[column.id] = column
      return acc
    }, {})
  }, [columns])

  async function createItem(input: {
    title: string
    description?: string
    columnId: string
    priority: Item['priority']
    dueDate?: string
    tags?: string[]
    parentId?: string | null
  }) {
    if (!boardId) return null

    const column = columnsById[input.columnId]
    const { data, error } = await supabase
      .from('items')
      .insert({
        board_id: boardId,
        column_id: input.columnId,
        parent_id: input.parentId ?? null,
        title: input.title,
        description: input.description ?? null,
        status: column?.name ?? 'Pendente',
        priority: input.priority,
        due_date: input.dueDate ?? null,
        order_index: items.filter((item) => item.column_id === input.columnId).length,
      })
      .select('*')
      .single()

    if (error || !data) return null

    if (input.tags?.length) {
      await attachTags(data.id, input.tags)
    }

    setItems((prev) => [...prev, data])
    return data
  }

  async function createChildItem(
    parentId: string,
    input: Omit<Parameters<typeof createItem>[0], 'parentId'>
  ) {
    return createItem({ ...input, parentId })
  }

  async function updateItem(itemId: string, updates: Partial<Item>) {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', itemId)
      .select('*')
      .single()

    if (!error && data) {
      setItems((prev) => prev.map((item) => (item.id === itemId ? data : item)))
    }

    return data ?? null
  }

  async function deleteItem(itemId: string) {
    const { error } = await supabase.from('items').delete().eq('id', itemId)
    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== itemId && item.parent_id !== itemId))
    }
  }

  async function attachTags(itemId: string, names: string[]) {
    if (!boardId) return

    const existingTags = tags.reduce<Record<string, Tag>>((acc, tag) => {
      acc[tag.name.toLowerCase()] = tag
      return acc
    }, {})

    const toInsert = names
      .map((name) => name.trim())
      .filter(Boolean)
      .filter((name) => !existingTags[name.toLowerCase()])

    let createdTags: Tag[] = []
    if (toInsert.length) {
      const { data } = await supabase
        .from('tags')
        .insert(toInsert.map((name) => ({ board_id: boardId, name })))
        .select('*')

      createdTags = data ?? []
      setTags((prev) => [...prev, ...createdTags])
    }

    const tagIds = names
      .map((name) => existingTags[name.toLowerCase()]?.id)
      .filter(Boolean)
      .concat(createdTags.map((tag) => tag.id))

    if (tagIds.length) {
      await supabase
        .from('item_tags')
        .insert(tagIds.map((tagId) => ({ item_id: itemId, tag_id: tagId })))

      setItemTags((prev) => ({
        ...prev,
        [itemId]: names,
      }))
    }
  }

  async function moveItem(
    itemId: string,
    columnId: string,
    orderIndex: number
  ) {
    const column = columnsById[columnId]
    await updateItem(itemId, {
      column_id: columnId,
      status: column?.name ?? 'Pendente',
      order_index: orderIndex,
    })
  }

  async function moveItemBatch(
    itemId: string,
    columnId: string,
    orderIndex: number,
    orderedIds: string[]
  ) {
    const column = columnsById[columnId]

    await Promise.all([
      supabase
        .from('items')
        .update({
          column_id: columnId,
          status: column?.name ?? 'Pendente',
          order_index: orderIndex,
        })
        .eq('id', itemId),
      ...orderedIds.map((id, index) =>
        supabase
          .from('items')
          .update({ order_index: index })
          .eq('id', id)
      ),
    ])

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            column_id: columnId,
            status: column?.name ?? 'Pendente',
            order_index: orderIndex,
          }
        }
        const order = orderedIds.indexOf(item.id)
        return order === -1 ? item : { ...item, order_index: order }
      })
    )
  }

  async function reorderColumnItems(_columnId: string, orderedIds: string[]) {
    const updates = orderedIds.map((id, index) => ({ id, order_index: index }))
    await Promise.all(
      updates.map((update) =>
        supabase
          .from('items')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
      )
    )

    setItems((prev) =>
      prev.map((item) => {
        const match = updates.find((update) => update.id === item.id)
        return match ? { ...item, order_index: match.order_index } : item
      })
    )
  }

  return {
    columns,
    items,
    tags,
    itemTags,
    loading,
    createItem,
    updateItem,
    moveItem,
    moveItemBatch,
    reorderColumnItems,
    deleteItem,
    createChildItem,
  }
}
