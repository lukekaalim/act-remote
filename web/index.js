// @flow strict
/*::
import type {
  JSONDiff,
  JSONElement,
  JSONValue,
  RemoteRenderHost,
} from "../remote";
import type { Component } from "@lukekaalim/act";
*/

import { removeNode } from "@lukekaalim/act-web";
import { createManagedJSONRenderer } from "../remote/renderer";

export const createRemoteWebClient = (
  host/*: {
    invoke: RemoteRenderHost["invoke"],
    subscribe: RemoteRenderHost["subscribe"]
  }*/
) => {
  const eventListenerMap = new Map();

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

  const serializeEvent = (event/*: Event*/)/*: { [string]: JSONValue }*/ => {
    return {
      type: event.type,
      currentTarget: event.currentTarget.toString(),
      target: event.target.toString(),
      timeStamp: event.timeStamp,
      eventPhase: event.eventPhase,
    }
  }
  const serializeMouseEvent = (event/*: MouseEvent*/)/*: { [string]: JSONValue }*/ => {
    return {
      ...serializeEvent(event),
      clientX: event.clientX,
      clientY: event.clientY,
    }
  }
  const getSerializedEvent = (event/*: mixed*/) => {
    if (event instanceof MouseEvent)
      return serializeMouseEvent(event);
    if (event instanceof Event)
      return serializeEvent(event);
    return { ...event };
  }

  const createDefaultEventListener = (diff, name) => (event/*: mixed*/) => {
    host.invoke(
      diff.next.id,
      name,
      [getSerializedEvent(event)]
    );
  };

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
          const event = name.substring(2).toLowerCase();
          const listener = eventListeners.get(name);
          (node/*: any*/).removeEventListener(event, listener)
        }
      });
      diff.next.element.props.map(([name, prop]) => {
        if (prop.type === 'mixed') {
          (node/*: any*/)[name] = prop.value;
        } else {
          const event = name.substring(2);
          const listener = createDefaultEventListener(diff, name);
          (node/*: any*/).addEventListener(event, listener)
          eventListeners.set(name, listener);
        }
      });
    }
  }
  
  const createNode = (element/*: JSONElement*/, namespace/*: string*/)/*: null | Node*/ => {
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

  const setRef = (
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

  const web = createDOMRenderer();
  const unsubscribeHost = host.subscribe(diff => {
    const parsedDiff = JSON.parse(JSON.stringify(diff));
    const { body } = document;
    if (!body)
      return;
    setNodeChildren(parsedDiff, body, web.render(parsedDiff));
  });
}