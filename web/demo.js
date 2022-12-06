// @flow strict
/*::
import type { JSONDiff, JSONElement } from "../remote";
import type { Component } from "@lukekaalim/act";
*/

import { createRemoteWebClient } from ".";

const renderHost = {
  invoke: (node, prop, value) => {
    worker.postMessage({ type: 'invoke', invoke: { node, prop, value }});
    return null;
  },
  subscribe: (onDiff) => {
    const listener = (message/*: MessageEvent*/) => {
      const data = (message.data/*: any*/);
      switch (data.type) {
        case 'diff':
          onDiff(data.diff);
          break;
      }
    };
    worker.addEventListener('message', listener)
    return () => {
      worker.removeEventListener('message', listener)
    };
  }
};

const worker = new Worker(new URL('./app.js', import.meta.url).href, { type: 'module' });
createRemoteWebClient(renderHost);

worker.postMessage({ type: 'ready' });