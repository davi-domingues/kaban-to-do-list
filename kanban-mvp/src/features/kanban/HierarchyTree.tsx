type TreeNode = {
  id: string
  title: string
  children?: TreeNode[]
}

export default function HierarchyTree({
  nodes,
}: {
  nodes: TreeNode[]
}) {
  return (
    <div className="tree">
      {nodes.map((node) => (
        <div key={node.id} className="tree-node">
          <div className="tree-label">{node.title}</div>
          {node.children && node.children.length > 0 ? (
            <div className="tree-children">
              <HierarchyTree nodes={node.children} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
