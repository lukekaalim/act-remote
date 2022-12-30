package com.lukekaalim.actremoteclient

public interface Renderer<T> {
    fun render(diff: Diff): List<RenderResult<T>>;
}

public class RenderResult<T>(val node: T, val commit: Commit);

public class ManagedRenderer<T>(val options: Options<T>): Renderer<T> {
    class Options<Node>(
        val add: (
            diff: Diff,
            element: ElementComponent
        ) -> Node?,
        val update: (
            diff: Diff,
            node: Node,
            children: List<RenderResult<Node>>
        ) -> Unit,
        val delete: (
            diff: Diff,
            node: Node,
            children: List<RenderResult<Node>>
        ) -> Unit,
    )
    private val nodes = mutableMapOf<String, T>();

    private fun createNode(diff: Diff): T? {
        val node = when (val component = diff.next.element.component) {
            is FunctionComponent -> null
            is ElementComponent ->  options.add(diff, component)
            else -> null
        }
        if (node != null)
            nodes[diff.next.id] = node;
        return node
    }

    private fun updateNode(node: T, diff: Diff, children: List<RenderResult<T>>) {
        options.update(diff, node, children);
    }

    private fun removeNode(node: T, diff: Diff, children: List<RenderResult<T>>) {
        options.delete(diff, node, children);
        nodes.remove(diff.next.id);
    }

    private fun getNodes(commit: Commit): List<RenderResult<T>> {
        val node = nodes[commit.id];
        if (node != null)
            return listOf(RenderResult(node, commit));

        return commit.children.flatMap { getNodes(it) };
    }

    override fun render(diff: Diff): List<RenderResult<T>> {
        val node = nodes[diff.next.id] ?: createNode(diff)
        val children = diff.diffs.flatMap { render(it) };

        val hasDiff = diff.next.version !== diff.prev.version;

        if (node == null) {
            return if (!hasDiff)
                getNodes(diff.next);
            else
                children;
        }

        updateNode(node, diff, children);

        if (!diff.next.pruned)
            return listOf(RenderResult(node, diff.next));

        removeNode(node, diff, children);
        return emptyList();
    }
}

/*
export const createManagedJSONRenderer = /*:: <TNode>*/(
  options/*: RendererOptions<TNode>*/
)/*: Renderer<TNode> & { nodesByCommitID: Map<CommitID, TNode> }*/ => {
  const { add, remove, update, next, getExternalNodes } = options;
  const nodesByCommitID/*: Map<CommitID, TNode>*/ = new Map();

  const createNode = (diff) => {
    const { component } = diff.next.element;
    switch (component.type) {
      default:
      case 'function':
        return null;
      case 'element':
        switch (component.name) {
          case 'act:null':
            return null;
          default:
            const node = add(diff);
            if (node)
              nodesByCommitID.set(diff.next.id, node);
            return node;
        }
    }
  }
  const removeNode = (diff, node) => {
    remove(node);
    nodesByCommitID.delete(diff.next.id);
  };
  const getNodes = (commit)/*: RenderResult<TNode>[]*/ => {
    const node = nodesByCommitID.get(commit.id);
    if (node)
      return [{ node, commit }];
    const external = getExternalNodes && getExternalNodes(commit);
    if (external)
      return external;
    return commit.children.map(getNodes).flat(1);
  }
  const render = (diff, _)/*: RenderResult<TNode>[]*/ => {
    const node = nodesByCommitID.get(diff.next.id) || createNode(diff);
    const children = diff.diffs.map(diff => (next || render)(diff, node)).flat(1);

    const hasDiff = diff.next.id !== diff.prev.id;

    if (!node)
      if (!hasDiff)
        return getNodes(diff.next);
      else
        return children;

    update(node, diff, children);

    if (!diff.next.pruned)
      return [{ node, commit: diff.next }];

    removeNode(diff, node);
    return [];
  };

  return { render, getNodes, nodesByCommitID };
};
 */