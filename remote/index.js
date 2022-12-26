// @flow strict
/*::
import type { Element } from '@lukekaalim/act';
import type { CommitDiff, CommitID, Commit, CommitRef } from "@lukekaalim/act-reconciler";
import type { Suspension } from "@lukekaalim/act-reconciler";
*/

// Sends render information somewhere else

import { createTree } from "@lukekaalim/act-reconciler";

/*::
export type JSONValue =
  | number
  | string
  | boolean
  | null
  | {| +[string]: JSONValue |}
  | $ReadOnlyArray<JSONValue>
  | Symbol

export type JSONProp =
  | { type: 'mixed', value: JSONValue }
  | { type: 'function' }

export type JSONElement = {
  component:
    | { type: 'function' }
    | { type: 'element', name: string },
  props: [string, JSONProp][],
};
export type JSONSuspension = {
  ref: CommitRef,
  value: JSONValue,
}

export type JSONCommit = {
  ...CommitRef,
  element: JSONElement,
  suspension: null | JSONSuspension,
  version: string,
  pruned: boolean,
  children: JSONCommit[],
}

export type JSONDiff = {
  diffs: JSONDiff[],
  prev: JSONCommit,
  next: JSONCommit
};

export type RemoteRenderHost = {
  subscribe: ((diff: JSONDiff) => mixed) => () => void,

  mount: (element: Element) => () => mixed;

  invoke: (id: CommitID, prop: string, value: $ReadOnlyArray<JSONValue>) => JSONValue,
};
*/

const createJSONValue = (value/*: mixed*/)/*: JSONValue*/ => {
  switch (typeof value) {
    default:
      return null;
    
    case 'boolean':
    case 'number':
    case 'string':
      return value;
    
    case 'object':
      if (Array.isArray(value))
        return value.map(createJSONValue);
      else if (value === null)
        return null;
      else
        return (Object.entries(Object.keys(value).map(k => createJSONValue(value[k])))/*: any*/)
  }
}

const createJSONProp = (prop/*: mixed*/)/*: JSONProp*/ => {
  if (typeof prop === 'function')
    return { type: 'function' };
  return { type: 'mixed', value: createJSONValue(prop) }
}
const createJSONElement = (element/*: Element*/)/*: JSONElement*/ => {
  return {
    component: typeof element.type === 'string'
      ? { type: 'element', name: element.type }
      : { type: 'function' },
    props: Object.keys(element.props).map(p => [p, createJSONProp(element.props[p])]),
  }
}
const createJSONCommit = (commit/*: Commit*/)/*: JSONCommit*/ => {
  return {
    ...commit,
    suspension: commit.suspension && {
      ...commit.suspension,
      value: createJSONValue(commit.suspension.value)
    },
    element: createJSONElement(commit.element),
    children: commit.children.map(createJSONCommit),
  }
}
const createJSONDiff = (commitDiff/*: CommitDiff*/)/*: JSONDiff*/ => {
  return {
    diffs: commitDiff.diffs.map(createJSONDiff),
    next: createJSONCommit(commitDiff.next),
    prev: createJSONCommit(commitDiff.prev),
  };
}

export const createRemoteRendererHost = (
  scheduleWork/*: (c: () => mixed) => number*/,
  cancelWork/*: (number) => void*/,
)/*: RemoteRenderHost*/ => {
  const listeners = new Set();
  const nodes = new Map();

  const traverseDiff = (diff) => {
    for (const childDiff of diff.diffs)
      traverseDiff(childDiff)

    if (diff.next.pruned)
      nodes.delete(diff.next.id);
    else
      nodes.set(diff.next.id, diff.next);
  }

  const onDiff = (commitDiff) => {
    console.log(JSON.stringify(commitDiff, null, 2));
    traverseDiff(commitDiff);

    for (const { handler } of listeners)
      handler(createJSONDiff(commitDiff));
  }

  const options = {
    onDiff,
    scheduleWork,
    cancelWork,
  };

  const mount = (element) => {
    createTree(element, options);
    return () => {
      // onunmount
    }
  }

  const subscribe = (handler) => {
    const listener = { handler };
    listeners.add(listener);
    return () => void listeners.delete(listener);
  };

  const invoke = (id, prop, value) => {
    const node = nodes.get(id);
    if (!node)
      throw new Error();
    const propValue = node.element.props[prop];
    if (typeof propValue !== 'function')
      throw new Error();
    
    const result = ((propValue/*: any*/)/*: (...$ReadOnlyArray<JSONValue>) => JSONValue*/)(...value);
    return result;
  }

  return {
    subscribe,
    invoke,
    mount
  };
}