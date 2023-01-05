// @flow strict
import { createContext, h, useContext, useState } from "@lukekaalim/act";
import { createRemoteRendererHost } from "@lukekaalim/act-remote-renderer";

/*::
import type { JSONDiff, JSONValue } from "@lukekaalim/act-remote-renderer";
import type { BasicBridge } from "@lukekaalim/platform-bridge";
import type { Context } from "@lukekaalim/act";

export type Platform = {
  ...BasicBridge
};
*/

const bridgeContext/*: Context<?Platform>*/ = createContext(null);
const usePlatform = () => {
  const platform = useContext(bridgeContext);
  if (!platform)
    throw new Error();
  return platform;
}

const LinearStack = ({ orientation, children }) => {
  const platform = usePlatform();
  switch (platform.device.platformFamilyType) {
    case 'android':
      return h('android:linear_layout', { orientation }, children)
    case 'ios':
      return h('ios:stack_view', { orientation }, children)
    default:
      return null;
  }
};
const Button = ({ onClick, label }) => {
  const platform = usePlatform();
  switch (platform.device.platformFamilyType) {
    case 'android':
      return h('android:button', { onClick, content: label, layoutWeight: 1 })
    case 'ios':
      return h('ios:button', { onPress: onClick, titleText: label })
    default:
      return null;
  }
}
const Text = ({ content }) => {
  const platform = usePlatform();
  switch (platform.device.platformFamilyType) {
    case 'android':
      return h('android:text', { layoutWeight: 1, content })
    default:
      return null;
  }
}

const App = ({ platform }) => {
  const [count, setCount] = useState/*:: <number>*/(0);

  const onClick = () => {
    setCount(count + 1);
  }

  return [
    h(bridgeContext.Provider, { value: platform }, [
      h(LinearStack, { orientation: 'vertical' }, [
        h(Text, { content: `Clicked ${count} times` }),
        h(Button, { onClick, label: 'Click me!' }),
      ]),
    ]),
  ];
}

export const main = (platform/*: Platform*/) => {
  const { console, timeout, render } = platform;
  global.console = console;
  
  const host = createRemoteRendererHost(
    c => { timeout.setTimeout(function myFunc() {
      c()
    }, 0); return 1; },
    id => {}
  )
  host.subscribe(render.submitDiff);

  render.subscribeCallback((commit, prop, value) => {
    host.invoke(commit, prop, value)
  })

  console.log('Mounted App')
  host.mount(h(App, { platform }))
};

global.main = main;