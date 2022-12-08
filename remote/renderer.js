// @flow strict
/*::
import type { JSONCommit, JSONDiff } from ".";
import type { CommitID } from "@lukekaalim/act-reconciler";
*/
/*::
export type RenderResult<TNode> = {
  commit: JSONCommit,
  node: TNode,
};
export type Renderer<TNode> = {
  render: (diff: JSONDiff) => RenderResult<TNode>[],
  getNodes: (commit: JSONCommit) => RenderResult<TNode>[],
}
export type RendererOptions<TNode> = {
  add: (diff: JSONDiff) => null | TNode,
  update: (node: TNode, diff: JSONDiff, children: RenderResult<TNode>[]) => void,
  remove: (node: TNode) => void,

  next?: (diff: JSONDiff, parent: null | TNode) => RenderResult<TNode>[],
  getExternalNodes?: (commit: JSONCommit) => ?RenderResult<TNode>[],
};
*/

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