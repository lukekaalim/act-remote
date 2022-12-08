// @flow strict
import { h, useState } from "@lukekaalim/act";
import { createRemoteRendererHost } from "@lukekaalim/act-remote-renderer";

/*::
import type { JSONDiff, JSONValue } from "@lukekaalim/act-remote-renderer";
import type { CommitID } from "@lukekaalim/act-reconciler";

export type Platform = {
  log: (value: string) => void,

  onDiff: (diff: JSONDiff) => void,
  subscribeInvoke: (
    listener: (commit: CommitID, prop: string, value: JSONValue[]) => mixed
  ) => void,

  setTimeout: (onTimeout: () => mixed, duration: number) => number,
  cancelTimeout: (timeoutId: number) => void,
};
*/

const App = () => {
  const [count, setCount] = useState/*:: <number>*/(0);
  return [
    'Hello World!',
    `You've clicked me ${count} times`,
    h('android:button', { onClick: () => setCount(c => c + 1), content: "Button" })
  ];
}

export const main = (platform/*: Platform*/) => {
  platform.log("Hello world!")
  platform.log("I'm calling from Javascript into Android!")

  const host = createRemoteRendererHost(
    c => platform.setTimeout(c, 10),
    id => platform.cancelTimeout(id)
  )
  host.subscribe(platform.onDiff);
  host.mount(h(App))
  platform.subscribeInvoke((commit, prop, value) => host.invoke(commit, prop, value))
};

global.main = main;