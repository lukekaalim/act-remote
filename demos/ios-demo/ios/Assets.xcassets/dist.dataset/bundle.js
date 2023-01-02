// @flow strict
// This file is mostly from nanoid

// This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
// optimize the gzip compression for this alphabet.
const urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';

const createId = ()/*: string*/ => {
  let id = '';
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = 8;
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id
};

// @flow strict
/*::
export type ElementNode =
  | string
  | number
  | false
  | null
  | $ReadOnlyArray<ElementNode>
  | Element

export type ElementType = string | Component<Props>;

export opaque type ElementID: string = string;
export type Element = {|
  +id: ElementID,
  +type: ElementType,
  +props: { +[string]: mixed },
  +children: $ReadOnlyArray<Element>,
|};
*/

const defaultProps = {};
const defaultChildren = [];

const createElement = /*:: <T: {}>*/(
  type/*: Component<T>*/,
  props/*: T*/ = (defaultProps/*: any*/),
  children/*: ElementNode*/ = defaultChildren
)/*: Element*/ => ({
  id: createId(),
  // $FlowFixMe
  type,
  props,
  children: normalizeElement(children),
});

const normalizeElement = (element/*: ElementNode*/)/*: Element[]*/ => {
  if (Array.isArray(element))
    return element.map(normalizeElement).flat(1);
  if (!element && typeof element !== 'number')
    return [createElement('act:null')];
  switch (typeof element) {
    case 'number':
    case 'string':
      return [createElement('act:string', { content: element.toString() })];
    case 'object':
      return [element];
    default:
      throw new Error('Unexpected element');
  }
};

// @flow strict
/*:: import type { Context } from './context.js'; */
/*::
export type Updater<T> = (previousValue: T) => T;
export type SetValue<T> = (value: T | Updater<T>) => void;
export type UseState = <T>(initialValue: T | () => T) => [T, SetValue<T>];

type CleanupFunc = () => mixed;
export type Deps = null | mixed[];
type Effect = () => ?CleanupFunc;
export type UseEffect = (effect: Effect, deps?: Deps) => void;

export type UseContext = <T>(context: Context<T>) => T;

export type Ref<T> = { current: T };

export type UseMemo = <T>(calc: () => T, deps?: Deps) => T;
export type UseRef = <T>(initial: T) => Ref<T>;

export type Hooks = {|
  useState: UseState,
  useEffect: UseEffect,
  useContext: UseContext,
|};
*/

const setRegistry = (newHooks/*: Hooks*/) => {
  registry = newHooks;
};

// Global registry for hooks. This is set magically every component render by the reconciler.
let registry/*: Hooks*/ = {
  useState: () => { throw new Error(`Unset global hook`); },
  useEffect: () => { throw new Error(`Unset global hook`); },
  useContext: () => { throw new Error(`Unset global hook`); },
};

const useState/*: UseState*/ = /*:: <T>*/(
  initialValue/*: T | () => T*/,
)/*: [T, SetValue<T>]*/ => registry.useState/*:: <T>*/(initialValue);

// @flow strict

/*::
export type BoundaryService = {
  
};
*/

const createBoundaryService = ()/*: BoundaryService*/ => {
  


  return {
    //tryBoundaryCommit,
  };
};

// @flow strict
/*::
export type IndexChangeSet = {
  created: number[],
  persisted: number[],
  removed: number[],
  moved: [number, number][],
};
*/

const calculateIndexChanges = /*:: <A, B>*/(
  prev/*: $ReadOnlyArray<A>*/,
  next/*: $ReadOnlyArray<B>*/,
  isEqual/*: (a: A, b: B) => boolean*/ = (a, b) => a === b
)/*: IndexChangeSet*/ => {
  const created = [];
  const persisted = [];
  const moved = [];
  const removed = [];

  for (let nextIndex = 0; nextIndex < next.length; nextIndex++) {
    const nextElement = next[nextIndex];
  
    const prevIndex = prev.findIndex(a => isEqual(a, nextElement));
    if (prevIndex === -1) {
      // There is no previous index, this element was just created
      created.push(nextIndex);
    } else {
      // there is a prev & next index, this element persisted
      if (prevIndex === nextIndex) {
        persisted.push(nextIndex);
      } else {
        moved.push([prevIndex, nextIndex]);
      }
    }
  }
  for (let prevIndex = 0; prevIndex < prev.length; prevIndex++) {
    const prevElement = prev[prevIndex];
    const nextIndex = next.findIndex(b => isEqual(prevElement, b));
    if (nextIndex === -1)  {
      // there is no next index, this element has been removed
      removed.push(prevIndex);
    }
  }

  return {
    created,
    persisted,
    removed,
    moved,
  };
};

// @flow strict

/*::
export type CommitID = string;
export type CommitPath = CommitID[];
export type CommitVersion = string;

export type CommitRef = {
  id: CommitID,
  path: CommitPath
};
export type Suspension = {
  ref: CommitRef,
  value: mixed,
};
export type Commit = {
  ...CommitRef,

  pruned: boolean,
  suspension: null | Suspension,
  version: CommitVersion,
  element: Element,
  children: $ReadOnlyArray<Commit>,
};
*/

/*::
export type CommitDiff = {|
  +prev: Commit,
  +next: Commit,
  +diffs: $ReadOnlyArray<CommitDiff>,
|}

export type BranchState = {|
  path: CommitPath,
  context: { [id: ContextID]: BranchContext<any> },
|};

export type Change = {
  targets: CommitRef[],
  prev: Commit,
  element?: ?Element
};

export type CommitService = {|
  render: (change: Change, branch?: BranchState) => CommitDiff,
|};
*/

const emptyBranchState/*: BranchState*/ = {
  path: [],
  context: {}
};
const createEmptyCommit = (branch/*: BranchState*/ = emptyBranchState)/*: Commit*/ => ({
  id: createId(),
  path: branch.path,
  version: createId(),
  element: deadElement,
  children: [],
  pruned: true,
  suspension: null,
});
const deadElement = createElement('act:dead');


const createCommitService = (
  componentService/*: ComponentService*/,
  contextService/*: ContextService*/,
  boundaryService/*: BoundaryService*/,
)/*: CommitService*/ => {

  const elementHasKey = (element) => {
    return (
      typeof element.props.key !== 'undefined' &&
      element.props.key !== null
    )
  };
  
  const isEqual = ([commitIndex, commit], [elementIndex, element]) => {
    const prevHasKey = elementHasKey(commit.element);
    const nextHasKey = elementHasKey(element);
  
    const isSameElement = commit.element.id === element.id;
    const isSameType = commit.element.type === element.type;
    const isSameKey = commit.element.props.key === element.props.key;
    const isSameIndex = commitIndex === elementIndex;
  
    return (
      isSameType && (
        isSameElement ||
        (prevHasKey && nextHasKey) ?
          isSameKey : (prevHasKey || nextHasKey) ?
            false : isSameIndex
      )
    );
  };

  const calculateChanges = (prev, next)/*: [Element, ?Commit][]*/ => {
    const { moved, persisted, removed } = calculateIndexChanges(
      prev.map((c, i) => [i, c]),
      next.map((e, i) => [i, e]),
      isEqual
    );
    const nextCommitByIndex = new Map([
      ...persisted.map(nextIndex => [nextIndex, prev[nextIndex]]),
      ...moved.map(([prevIndex, nextIndex]) => [nextIndex, prev[prevIndex]])
    ]);
  
    return [
      ...next.map((next, index) => [next, nextCommitByIndex.get(index) || null]),
      ...removed.map(index => [deadElement, prev[index]])
    ];
  };

  const calculateNextBranch = (prevBranch, prevCommit, element) => {
    if (!element)
      return prevBranch;
    
    const path = [...prevBranch.path, prevCommit.id];
    const branchWithPath = { ...prevBranch, path };
    switch (element.type) {
      case 'act:context':
        return contextService.calculateNextBranch(element, prevCommit, branchWithPath);
      default:
        return branchWithPath;
    }
  };
  const calculateNextChildren = (commit, nextElement, branch) => {
    const element = (nextElement || commit.element);
  
    switch (typeof element.type) {
      case 'function':
        return componentService.calculateNextChildren(commit, element, branch);
      case 'string':
        switch (element.type) {
          case 'act:dead':
            return [[], null];
          default:
            return [element.children, null];
        }
      default:
        throw new Error(`Don't know how to traverse element of this type`);
    }
  };
  const calculateNextTargets = (nextElement, commit, prevTargets, branch) => {
    const element = (nextElement || commit.element);
    const depth = branch.path.length;

    const validTargets = prevTargets.filter(ref => ref.path[depth] === commit.id);

    switch (element.type) {
      case 'act:context':
        return [...contextService.calculateNextTargets(element, commit), ...validTargets];
      default:
        return validTargets;
    }
  };

  const remove = (prev) => {
    if (typeof prev.element.type === 'function')
      componentService.teardownComponent(prev);
  
    const diffs = prev.children.map(remove);

    const next = {
      ...prev,
      version: createId(),
      pruned: true,
      children: [],
    };
    return { prev, next, diffs };
  };
  const skip = (prev) => {
    return { prev, next: prev, diffs: [] };
  };
  const climb = (prev, targets, branch) => {
    const nextBranch = calculateNextBranch(branch, prev, prev.element);
    const diffs = prev.children.map(prev =>
      render({ prev, targets }, nextBranch));

    const commit = {
      ...prev,
      version: createId(),
      children: diffs.map(d => d.next).filter(c => !c.pruned),
    };
    return { prev, next: commit, diffs };
  };

  const render = ({ prev, element, targets }/*: Change*/, branch/*: BranchState*/ = emptyBranchState)/*: CommitDiff*/ => {
    const isTarget = targets.find(target => target.id === prev.id);

    const newElement = element && (element.id !== prev.element.id);
    const destroyingElement = element && element.type === 'act:dead';

    const validTargets = calculateNextTargets(element, prev, targets, branch);

    const requiresRender = newElement || destroyingElement || isTarget;

    if (!requiresRender)
      if (validTargets.length === 0)
        return skip(prev);
      else
        return climb(prev, validTargets, branch);

    if (destroyingElement)
      return remove(prev);

    const nextElement = element || prev.element;

    const nextBranch = calculateNextBranch(branch, prev, nextElement);
    const [nextChildren, nextSuspension] = calculateNextChildren(prev, nextElement, nextBranch);

    const prevChildren = calculateChanges(prev.children, nextChildren);

    const diffs = prevChildren.map(([element, commit]) =>
      render({ element, prev: commit || createEmptyCommit(nextBranch), targets: validTargets }, nextBranch));

      /*
    const boundaryDiff = boundaryService.tryBoundaryCommit(ref, change, diffs, branch, render);
    if (boundaryDiff)
      return boundaryDiff;
*/
    const next = {
      ...prev,
      pruned: false,
      version: createId(),
      element: nextElement,
      //suspension: result.suspension || diffs.map(d => d.next.suspension).find(Boolean) || null,
      children: diffs.map(d => d.next).filter(c => !c.pruned)
    };

    return { prev, next, diffs };
  };

  return {
    render,
  };
};

// @flow strict

/*::
export type ComponentState = {
  ref: CommitRef,
  values: Map<mixed, {|
    value: any,
    setValue: SetValue<any>,
  |}>,
  effects: Map<mixed, {|
    id: EffectID,
    cleanup: ?(() => mixed),
    deps: Deps,
  |}>,
  contexts: Set<CommitRef>,
};

export type ComponentService = {
  calculateNextChildren: (commit: Commit, element: Element, branch: BranchState) => [Element[], ?Suspension],
  teardownComponent: (commit: Commit) => void,
};
*/


const depsAreEqual = (depsA/*: Deps*/, depsB/*: Deps*/)/*: boolean*/ => {
  if (depsA === null || depsB === null)
    return false;
  if (depsA.length !== depsB.length)
    return false;
  return depsA.every((value, index) => value === depsB[index]);
};

const createComponentService = (
  scheduler/*: Scheduler*/,
  contextService/*: ContextService*/
)/*: ComponentService*/ => {
  const componentStates = new Map();
  
  const loadHooks = (state/*: ComponentState*/, branch)/*: Hooks*/ => {
    let key = 0;

    const createUseStateHook = /*:: <T>*/(initialValue/*: T*/) => {
      // $FlowFixMe[incompatible-use]
      const getValue = v => typeof v === 'function' ? v(hook.value) : v;

      const setValue = (newValue) => {
        const nextHookValue = getValue(newValue);
        if (nextHookValue === hook.value)
          return;
        hook.value = nextHookValue;
        scheduler.scheduleChange(state.ref);
        scheduler.scheduleFlush();
      };
    
      const hook = {
        // $FlowFixMe[incompatible-use]
        value: typeof initialValue === 'function' ? initialValue() : initialValue,
        setValue,
      };
      state.values.set(key, hook);
      return hook;
    };
  
    const useState/*: UseState*/ = /*:: <T>*/(initialValue) => {
      const hook = state.values.get(key) || createUseStateHook(initialValue);
      key++;
      return [hook.value, hook.setValue];
    };
    const useEffect = (newEffect, newDeps = null) => {
      const effect = state.effects.get(key) || { id: createId(), deps: null, cleanup: null };
      state.effects.set(key, effect);
      if (depsAreEqual(newDeps, effect.deps)) {
        key++;
        return;
      }
      const run = () => {
        if (effect.cleanup)
          effect.cleanup();
        effect.cleanup = newEffect();
      };
      effect.deps = newDeps;
      scheduler.scheduleEffect({ id: effect.id, priority: 'sync', run });
      scheduler.scheduleFlush();
      key++;
      return;
    };
    const useContext = /*:: <T>*/(context/*: Context<T>*/)/*: T*/ => {
      const contextState = branch.context[context.contextId];

      if (!contextState)
        return context.defaultValue;

      if (!state.contexts.has(contextState.ref)) {
        contextService.attachSubscriber(contextState.ref, state.ref);
        state.contexts.add(contextState.ref);
      }

      return contextState.value;
    };
  
    // $FlowFixMe[prop-missing]
    return { useState, useEffect, useContext };
  };
  const teardownHooks = (state) => {
    for (const [, { id, cleanup }] of state.effects)
      if (cleanup) {
        scheduler.scheduleEffect({ id, priority: 'sync', run: () => void cleanup() });
      }
    if (state.effects.size > 0)
      scheduler.scheduleFlush();
    
    componentStates.delete(state.ref.id);
  };

  const createNewComponentState = (ref)/*: ComponentState*/ => {
    const state = {
      ref,
      values: new Map(),
      effects: new Map(),
      contexts: new Set(),
    };
    componentStates.set(ref.id, state);
    return state;
  };

  const renderComponent = (state, element, branch) => {
    const hooks = loadHooks(state, branch);
    setRegistry(hooks);
    if (typeof element.type !== 'function')
      throw new Error('Components must be functions');
    try {
      const elementNode = element.type({ ...element.props, children: element.children });
      return [normalizeElement(elementNode), null];
    } catch (error) {
      return [null, error];
    }
  };

  const calculateNextChildren = (commit, element, branch) => {
    const state = componentStates.get(commit.id) || createNewComponentState(commit);
    if (element.type === 'act:dead') {
      teardownHooks(state);
      return [[], null];
    }
    const [children, error] = renderComponent(state, element, branch);

    return [children || [], { ref: commit, value: error }];
  };
  const teardownComponent = (commit) => {
    const state = componentStates.get(commit.id);
    if (state)
      teardownHooks(state);
  };

  return {
    calculateNextChildren,
    teardownComponent,
  };
};

// @flow strict
/*:: import type { Element, Component, Context, ContextID } from '@lukekaalim/act'; */

/*:: import type { BranchState, Commit, Change, CommitRef, CommitID } from './commit2.js'; */
/*:: import type { Scheduler } from './schedule.js'; */

/*::
export type BranchContext<T> = {|
  value: T,
  ref: CommitRef,
|};

export type ContextState<T> = {|
  subscribers: CommitRef[],
|};

export type ContextService = {|
  calculateNextBranch: (element: Element, commit: CommitRef, prev: BranchState) => BranchState,
  calculateNextTargets: (element: Element, prev: Commit) => CommitRef[],

  attachSubscriber: (context: CommitRef, subscriber: CommitRef) => void,
  detachSubscriber: (context: CommitRef, subscriber: CommitRef) => void,
|};
*/

const createContextService = ()/*: ContextService*/ => {
  const states = new Map();

  const attachSubscriber = (context, subscriber) => {
    const prevState = states.get(context.id) || { subscribers: [] };

    if (prevState.subscribers.find(c => c.id === subscriber.id))
      return;

    const nextState = { subscribers: [...prevState.subscribers, subscriber] };

    states.set(context.id, nextState);
  };
  const detachSubscriber = (context, subscriber) => {
    const prevState = states.get(context.id) || { subscribers: [] };

    const nextState = { subscribers: prevState.subscribers.filter(s => s.id !== subscriber.id) };

    states.set(context.id, nextState);
  };

  const calculateNextTargets = (element, prev) => {
    const { contextId, value } = (element.props/*: any*/);

    if (value === prev.element.props.value && contextId === prev.element.props.contextId)
      return [];
    
    const state = states.get(prev.id) || { subscribers: [] };
    return state.subscribers;
  };

  const calculateNextBranch = (element, ref, prev) => {
    const { contextId, value } = (element.props/*: any*/);

    return { ...prev, context: { ...prev.context, [contextId]: { value, ref } } };
  };

  return {
    attachSubscriber,
    detachSubscriber,

    calculateNextBranch,
    calculateNextTargets,
  };
};

// @flow strict
/*:: import type { CommitID, CommitRef } from './commit2.js'; */

/*::
export type EffectID = string;
export type EffectPriority =
  | 'sync'
  | 'render'
  | 'idle'
export type Effect = {
  id: EffectID,
  priority: EffectPriority,
  run: () => void,
};

export type ScheduleFunction<TCancelToken> = (callback: () => mixed) => TCancelToken;
export type CancelFunction<TCancelToken> = (token: TCancelToken) => mixed;

export type Scheduler = {
  scheduleEffect: (effect: Effect) => void,
  scheduleChange: (ref: CommitRef) => void,
  flushSync: () => void,
  scheduleFlush: () => void,
};
*/

const createScheduler = /*:: <T>*/(
  render/*: (targets: CommitRef[]) => void*/,
  schedule/*: ScheduleFunction<T>*/,
  cancel/*: CancelFunction<T>*/,
)/*: Scheduler*/ => {
  let token = null;

  const pendingChanges = new Map();
  const pendingEffects = new Map();

  const scheduleChange = (ref) => {
    pendingChanges.set(ref.id, ref);
  };
  const scheduleEffect = (effect) => {
    pendingEffects.set(effect.id, effect);
  };

  const scheduleFlush = () => {
    if (token === null) {
      token = schedule(flushSync);
    }
  };

  const flushSync = () => {
    if (token)
      cancel(token);
    token = null;
    
    const changes = [...pendingChanges.values()];
    pendingChanges.clear();
    render(changes);

    const effects = [...pendingEffects.values()];
    pendingEffects.clear();
    for (const effect of effects)
      effect.run();
  };

  return {
    scheduleChange,
    scheduleEffect,
    scheduleFlush,
    flushSync,
  };
};

// @flow strict

/*::
export type TreeOptions<T> = {
  onDiff?: CommitDiff => mixed,
  scheduleWork: ScheduleFunction<T>,
  cancelWork: CancelFunction<T>,
};
*/

const createTree = /*:: <T>*/(
  element/*: Element*/,
  options/*: TreeOptions<T>*/ = {}
) => {
  const {
    onDiff = (d) => {},
    scheduleWork,
    cancelWork,
  } = options;

  const render = (targets) => {
    const renderDiff = commit.render({ targets, prev });
    prev = renderDiff.next;
    
    if (prev.suspension)  
      throw prev.suspension.value;

    onDiff(renderDiff);
  };

  const schedule = createScheduler(render, scheduleWork, cancelWork);
  const context = createContextService();
  const component = createComponentService(schedule, context);
  createBoundaryService();
  const commit = createCommitService(component, context);

  const initDiff = commit.render({ element, prev: createEmptyCommit(), targets: [] });
  let prev = initDiff.next;
  onDiff(initDiff);

  schedule.flushSync();
};

// @flow strict

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
  id: ElementID,
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
};

const createJSONProp = (prop/*: mixed*/)/*: JSONProp*/ => {
  if (typeof prop === 'function')
    return { type: 'function' };
  return { type: 'mixed', value: createJSONValue(prop) }
};
const createJSONElement = (element/*: Element*/)/*: JSONElement*/ => {
  return {
    id: element.id,
    component: typeof element.type === 'string'
      ? { type: 'element', name: element.type }
      : { type: 'function' },
    props: Object.keys(element.props).map(p => [p, createJSONProp(element.props[p])]),
  }
};
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
};
const createJSONDiff = (commitDiff/*: CommitDiff*/)/*: JSONDiff*/ => {
  return {
    diffs: commitDiff.diffs.map(createJSONDiff),
    next: createJSONCommit(commitDiff.next),
    prev: createJSONCommit(commitDiff.prev),
  };
};

const createRemoteRendererHost = (
  scheduleWork/*: (c: () => mixed) => number*/,
  cancelWork/*: (number) => void*/,
)/*: RemoteRenderHost*/ => {
  const listeners = new Set();
  const nodes = new Map();

  const traverseDiff = (diff) => {
    for (const childDiff of diff.diffs)
      traverseDiff(childDiff);

    if (diff.next.pruned)
      nodes.delete(diff.next.id);
    else
      nodes.set(diff.next.id, diff.next);
  };

  const onDiff = (commitDiff) => {
    traverseDiff(commitDiff);

    for (const { handler } of listeners)
      handler(createJSONDiff(commitDiff));
  };

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
  };

  const subscribe = (handler) => {
    const listener = { handler };
    listeners.add(listener);
    return () => void listeners.delete(listener);
  };

  const invoke = (id, prop, value) => {
    const node = nodes.get(id);
    if (!node)
      throw new Error('No Node');
    const propValue = node.element.props[prop];
    if (typeof propValue !== 'function')
      throw new Error('Prop is not a function');
    const result = ((propValue/*: any*/)/*: (...$ReadOnlyArray<JSONValue>) => JSONValue*/)(...value);
    return result;
  };

  return {
    subscribe,
    invoke,
    mount
  };
};

// @flow strict

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
    createElement('ios:stack_view', { orientation: 'vertical' }, [

      createElement('ios:stack_view', { orientation: 'horizontal' }, [
        createElement('ios:label', { text: `${count} Count` }),
        createElement('ios:label', { text: 'Much!' }),
        createElement('ios:button', { text: 'Much!', onPress: () => {
          setCount(count + 1);
        } }),
      ]),
      createElement('ios:label', { text: 'Space!' }),
    ]),
    createElement('android:linear_layout', { orientation: 'vertical' }, [
      'Hello World!',
      `You've clicked me ${count} times`,
      createElement('android:linear_layout', { orientation: 'horizontal' }, [
        createElement('android:button', { onClick: () => setCount(c => c + 1), content: "Button" }),
        createElement('android:button', { onClick: () => setShowPlayer(p => !p), content: "Toggle Player" }),
      ]),
      showPlayer && createElement('android:exoplayer', { videoUri: 'https://storage.googleapis.com/wvmedia/clear/hevc/tears/tears.mpd' }),
    ]),
  ];
};

const main = (platform/*: Platform*/) => {
  const { console, timeout, render } = platform;
  global.console = console;
  
  const host = createRemoteRendererHost(
    c => { timeout.setTimeout(function myFunc() {
      c();
    }, 0); return 1; },
    id => {}
  );
  host.subscribe(render.submitDiff);

  render.subscribeCallback((commit, prop, value) => {
    host.invoke(commit, prop, value);
  });

  console.log('Mounted App');
  host.mount(createElement(App, { platform }));
};

global.main = main;

export { main };
