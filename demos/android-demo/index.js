// @flow strict
import { h, useState } from "@lukekaalim/act";
import { createRemoteRendererHost } from "@lukekaalim/act-remote-renderer";

/*::
import type { JSONDiff, JSONValue } from "@lukekaalim/act-remote-renderer";
import type { CommitID } from "@lukekaalim/act-reconciler";
import type { BasicBridge } from "../../bridge";

export type Platform = {
  ...BasicBridge
};
*/

const App = () => {
  const [count, setCount] = useState/*:: <number>*/(0);
  const [showPlayer, setShowPlayer] = useState/*:: <boolean>*/ (true);
  return [
    h('android:linear_layout', { orientation: 'vertical' }, [
      'Hello World!',
      `You've clicked me ${count} times`,
      h('android:linear_layout', { orientation: 'horizontal' }, [
        h('android:button', { onClick: () => setCount(c => c + 1), content: "Button" }),
        h('android:button', { onClick: () => setShowPlayer(p => !p), content: "Toggle Player" }),
      ]),
      showPlayer && h('android:exoplayer', { videoUri: 'https://storage.googleapis.com/wvmedia/clear/hevc/tears/tears.mpd' }),
    ]),
  ];
}

export const main = (platform/*: Platform*/) => {
  const { console, timeout, render } = platform;
  global.console = console;

  const host = createRemoteRendererHost(
    c => (timeout.setTimeout(c, 0), 0),
    id => {}
  )
  host.subscribe(render.submitDiff);
  render.subscribeCallback(host.invoke);
  host.mount(h(App, { platform }))
};

global.main = main;