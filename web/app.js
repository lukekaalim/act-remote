// @flow strict
/*::
import type { Component } from "@lukekaalim/act";
*/
import { h, useState } from "@lukekaalim/act";

export const App/*: Component<>*/ = () => {
  const [count, setCount] = useState/*:: <number>*/(0)

  return h('div', {}, [
    'Hello world!',
    h('button', {
      onclick: (e) => (console.log(e), setCount(c => c + 1))
    }, `Clicked ${count} times!`)
  ])
}