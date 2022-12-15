// @flow strict
/*::
import type { Component } from "@lukekaalim/act";
*/

import { createRemoteRendererHost } from "../remote";
import { h, useState } from "@lukekaalim/act";

const App/*: Component<>*/ = () => {
  const [count, setCount] = useState/*:: <number>*/(0)

  return h('div', {}, [
    'Hello world!',
    h('button', {
      onclick: (e) => (console.log(e), setCount(c => c + 1))
    }, `Clicked ${count} times!`),
  ])
}

const main = () => {
  const host = createRemoteRendererHost(
    c => (setInterval(c, 0)/*: any*/),
    n => clearInterval((n/*: any*/))
  );

  self.addEventListener('message', message => {
    const data = (message.data/*: any*/);
    switch (data.type) {
      case 'invoke':
        const { node, prop, value } = data.invoke;
        host.invoke(node, prop, value);
        break;
      case 'ready':
        host.mount(h(App));
        break;
    }
  });
  host.subscribe(diff => {
    self.postMessage({ type: 'diff', diff })
  })
};

main();