# react-single-hoc

## Example

### Main

[![Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/01z7mz90rv)

### Basic
```javascript
export const CounterManual = withHooks(use => {
  const { get, set } = use.state(0);
  const increment = () => set(get() + 1);
  const decrement = () => set(get() - 1);

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