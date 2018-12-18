
## 0.0.4
### API

```javascript
declare function createHOC<P, C>(hooks: Hooks<P, C> => (props: P) => ReactElement)

type Hooks<Props, Context> = {
    // get initial props and context
    getInitial: () => { props: Props, context: Context },
    // create local state
    newState: <S>(initialState: S) => { get: () => S, set: (newState: S) => void },

    addToComponentDidMount: (callback: (props: Props, context: Context) => any) => void,
    addToGetSnapshotBeforeUpdate: (callback: (props: Props, context: Context) => any) => void,
    addToComponentDidUpdate: (callback: (props: Props, context: Context) => any) => void,
    addToComponentWillUnmount: (callback: (props: Props, context: Context) => any) => void,
}
```

## 0.0.3
### API

> **WIP**

```javascript
type Hooks<Props, Context> = {
    // get initial props and context
    getInitial: () => { props: Props, context: Context },
    // create local state
    createState: <S>(initialState: S) => { get: () => S, set: (newState: S) => void },
    // subscribe to updates
    newEffect: ((props: Props, context: Context) => any) => void,
    // subscribe to mount and unmount
    subscribe: ((props: Props, context: Context) => () => void)) => void
}

declare function createHOC<P, C>(use: Use<P, C> => (props: P) => ReactElement)
```
