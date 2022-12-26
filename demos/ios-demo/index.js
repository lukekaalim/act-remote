// @flow strict
import { h, useState } from "@lukekaalim/act";
import { createRemoteRendererHost } from "@lukekaalim/act-remote-renderer";

/*::
import type { JSONDiff, JSONValue } from "@lukekaalim/act-remote-renderer";
import type { CommitID } from "@lukekaalim/act-reconciler";
import type { BasicBridge } from "@lukekaalim/platform-bridge";

export type Platform = {
  ...BasicBridge
};
*/

const App = ({ platform }) => {
  const [count, setCount] = useState/*:: <number>*/(0);
  const [showPlayer, setShowPlayer] = useState/*:: <boolean>*/ (true);
  return [
    h('ios:stack_view', { orientation: 'vertical' }, [

      h('ios:stack_view', { orientation: 'horizontal' }, [
        h('ios:label', { text: `${count} Count` }),
        h('ios:label', { text: 'Much!' }),
        h('ios:button', { text: 'Much!', onPress: () => {
          setCount(count + 1);
          console.log('SETTING COUNT')
        } }),
      ]),
      h('ios:label', { text: 'Space!' }),
    ]),
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
  console.log("Hello!")
  
  const host = createRemoteRendererHost(
    c => { timeout.setTimeout(function myFunc() {
      c()
    }, 0); return 1; },
    id => {}
  )
  console.log('Setup Remote Host')
  host.subscribe(render.submitDiff);

  console.log('Subscribed Invoke callback')
  render.subscribeCallback((commit, prop, value) => {
    console.log(`COMMIT ${commit}, prop: ${prop}, value: ${JSON.stringify(value)}`)
    host.invoke(commit, prop, value)
  })

  console.log('Mounted App')
  host.mount(h(App, { platform }))
};

global.main = main;