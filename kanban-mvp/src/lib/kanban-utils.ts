export function reorderIds(ids: string[], activeId: string, overId: string) {
  const from = ids.indexOf(activeId)
  const to = ids.indexOf(overId)
  if (from === -1 || to === -1) return ids
  const next = [...ids]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

type TreeItem = {
  id: string
  parent_id: string | null
  title: string
}

export function buildItemTree(items: TreeItem[], parentId: string) {
  const byParent = items.reduce<Record<string, TreeItem[]>>((acc, item) => {
    const key = item.parent_id ?? 'root'
    acc[key] = acc[key] ? [...acc[key], item] : [item]
    return acc
  }, {})

  const build = (id: string): { id: string; title: string; children: any[] }[] => {
    return (byParent[id] ?? []).map((child) => ({
      id: child.id,
      title: child.title,
      children: build(child.id),
    }))
  }

  return build(parentId)
}
