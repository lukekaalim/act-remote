// @flow strict
/*::
import type { JSONDiff, JSONElement } from "../remote";
import type { Component } from "@lukekaalim/act";
*/

import { createRemoteRendererHost } from "../remote"
import { h, useState } from "@lukekaalim/act";
import { removeNode } from "@lukekaalim/act-web";
import { createManagedJSONRenderer } from "../remote/renderer";

const App/*: Component<>*/ = () => {
  const [count, setCount] = useState/*:: <number>*/(0)
  return h('div', {}, [
    'Hello world!',
    h('button', {
      onclick: (e) => (console.log(e), setCount(c => c + 1))
    }, `Clicked ${count} times!`)
  ])
}

const host = createRemoteRendererHost();

const domNodes = new Map();

const eventListenerMap = new Map();

const setRemoteProps = (node, diff/*: JSONDiff*/) => {
  const eventListeners = eventListenerMap.get(diff.next.id) || new Map();
  eventListenerMap.set(diff.next.id, eventListeners);

  if (node instanceof Text) {
    const contentProp = diff.next.element.props.find(([name, value]) => name === 'content')
    if (contentProp && contentProp[1].type === 'mixed')
      node.textContent = (contentProp[1].value/*: any*/);
  }
  if (node instanceof HTMLElement) {
    diff.prev.element.props.map(([name, prop]) => {
      if (prop.type === 'function' && name.startsWith('on')) {
        const event = name.substring(2);
        const listener = eventListeners.get(name);
        console.log('removing listener');
        (node/*: any*/).removeEventListener(event, listener)
      }
    });
    diff.next.element.props.map(([name, prop]) => {
      if (prop.type === 'mixed') {
        (node/*: any*/)[name] = prop.value;
      } else {
        const event = name.substring(2);
        const listener = (...args) => {
          host.invoke(
            diff.next.id, name,
            JSON.parse(JSON.stringify(args))
          );
        };
        (node/*: any*/).addEventListener(event, listener)
        eventListeners.set(name, listener);
      }
    });
  }
}

export const createNode = (element/*: JSONElement*/, namespace/*: string*/)/*: null | Node*/ => {
  if (element.type.type === 'component')
    return null;
  
  const { name } = element.type;
  if (name === 'act:null')
    return null;
  if (name === 'act:string')
    return document.createTextNode('');
  if (name === 'act:context')
    return null;
  if (name === 'act:boundary')
    return null;
  return document.createElementNS(namespace, name);
};
export const setRef = (
  node/*: ?Node*/,
  diff/*: JSONDiff*/
) => {;
  const refProp = diff.next.element.props.find(([name]) => name === 'ref');
  const ref/*: any*/ = refProp && refProp[1].type === 'mixed' && refProp[1].value;
  if (typeof ref === 'function') {
    if (diff.prev.pruned)
      (ref/*: Function*/)(node);
    else if (diff.next.pruned)
      (ref/*: Function*/)(null);
  } else if (ref && typeof ref === 'object') {
    if (diff.prev.pruned)
      ref['current'] = node;
    else if (diff.next.pruned)
      ref['current'] = null;
  }
};

const createDOMRenderer = () => {
  const add = (diff)/*: null | Node*/ => {
    const node = createNode(diff.next.element, 'http://www.w3.org/1999/xhtml');
    if (node !== null) {
      const parentId = diff.next.path[diff.next.path.length - 1];
      nodeRenderer.nodesByCommitID.get(parentId);
    }
    return node;
  }
  const remove = (node) => {
    removeNode(node);
  };
  const update = (node, diff, children) => {
    setRef(node, diff);

    if (diff.next.pruned)
      return;

    setRemoteProps(node, diff);
    setNodeChildren(diff, node, children);
  }

  const nodeRenderer = createManagedJSONRenderer({ add, remove, update });
  return nodeRenderer;
};

const setNodeChildren = (_, parent, children) => {
  const childrenToAttach = children.filter(r => !r.commit.suspension).map(r => r.node);
  const childrenToRemove = children.filter(r => r.commit.suspension).map(r => r.node);
  for (let i = 0; i < childrenToRemove.length; i++)
    removeNode(childrenToRemove[i]);
  
  // iterate backwards through the children
  for (let i = childrenToAttach.length; i > 0; i--) {
    const child = childrenToAttach[i - 1];
    const rightSibling = childrenToAttach[i];
    if (parent !== child.parentNode || (rightSibling && child.nextSibling !== rightSibling)) {
      parent.insertBefore(child, rightSibling);
    }
  }
}

const web = createDOMRenderer();
host.subscribe(diff => {
  const parsedDiff = JSON.parse(JSON.stringify(diff));
  const { body } = document;
  if (!body)
    return;
  setNodeChildren(parsedDiff, body, web.render(parsedDiff));
})
host.mount(h(App));