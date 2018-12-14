# react-single-hoc

> Inspired by [React hooks](https://reactjs.org/docs/hooks-intro.html) and [react-factory-hooks](https://github.com/PutziSan/react-factory-hooks).

## Motivation

[Native hooks](https://reactjs.org/docs/hooks-intro.html) have no initial phase (because inlines in render function) therefore need to use memorization (need extra load) and some [rules](https://reactjs.org/docs/hooks-rules.html). "factory hooks" devoid these problems.

> detailed motivation about inline hooks vs factory hooks you can find in [react-factory-hooks](https://github.com/PutziSan/react-factory-hooks) proposal.

> difference between `react-single-hoc` and `react-factory-hooks` in usage local vs global hooks controller. Local controller is fully isolating hooks and simplifies testing.

Eventually `react-single-hoc` is a way to compose not HOCs, but their logic, for excuding cascade problems and [others](https://reactjs.org/docs/hooks-intro.html#motivation)

## Example

> ready status: **PoC**

### Main

[![Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/01z7mz90rv)

### Basic
```javascript
import createHOC from "@artalar/react-single-hoc"

// functional stateful component
export const Counter = createHOC(use => {
  // initial phase == constructor
  const { get, set } = use(({ newState }) => newState(0));
  const increment = () => set(get() + 1);
  const decrement = () => set(get() - 1);

  // render function
  return () => (
    <div>
      <p>count: {get()}</p>
      <p>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
      </p>
    </div>
  );
});
```

### API

> WIP

```javascript
type Use<Props, Context> = {
    // get initial props and context
    getInitial: () => { props: Props, context: Context },
    // create local state
    newState: <S>(initialState: S) => { get: () => S, set: (newState: S) => void },
    // subscribe to updates
    newEffect: ((props: Props, context: Context) => any) => void,
    // subscribe to mount and unmount
    subscribe: ((props: Props, context: Context) => () => void)) => void
}

declare function withHOC<P, C>(use: Use<P, C> => (props: P) => ReactElement)
```