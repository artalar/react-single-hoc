import React from 'react';

function preventUseHooksInRender() {
  throw new Error('You can not use hooks outside initial phase');
}

const context = React.createContext({});

export const Provider = context.Provider;

export function createHOC(renderCreator) {
  return class HooksController extends React.Component {
    // TODO: downgrade?
    static contextType = context.Consumer;

    constructor(props, context) {
      super(props, context);

      this._componentDidMountHooks = new Set();
      this._getSnapshotBeforeUpdateHooks = new Set();
      this._componentDidUpdateHooks = new Set();
      this._componentWillUnmountHooks = new Set();
      this.state = {
        // debug
        used: [],
      };
      this._contextExecutor = cb => cb(this.props, this.context);

      const stateUpdaters = [];
      const stateUpdateSubscribers = [];
      let stateObserverId = 0;
      let initialPhase = true;

      function updateState(state) {
        try {
          const newState = stateUpdaters.reduce(
            (acc, update) => Object.assign(acc, update(acc)),
            Object.assign({}, state),
          );
          return newState;
        } finally {
          stateUpdaters.length = 0;
        }
      }

      function publishUpdates(state) {
        try {
          stateUpdateSubscribers.forEach(cb => cb(state));
        } finally {
          stateUpdateSubscribers.length = 0;
        }
      }

      const startUpdateState = () => {
        this.setState(updateState, publishUpdates);
      };

      const hooks = {
        getInitial: () => {
          if (!initialPhase) preventUseHooksInRender();
          return { props, context };
        },
        createState: initialState => {
          if (!initialPhase) preventUseHooksInRender();
          const id = stateObserverId++;
          this.state[id] = initialState;
          return {
            get: () => this.state[id],
            set: (update, cb) => {
              const updateCallback =
                typeof update === 'function' ? update : () => update;
              stateUpdaters.push(state => ({
                [id]: updateCallback(state[id]),
              }));
              if (cb) stateUpdateSubscribers.push(cb);
              startUpdateState();
            },
          };
        },
        addToComponentDidMount: callback => {
          if (!initialPhase) preventUseHooksInRender();
          this._componentDidMountHooks.add(callback);
        },
        addToGetSnapshotBeforeUpdate: callback => {
          if (!initialPhase) preventUseHooksInRender();
          this._getSnapshotBeforeUpdateHooks.add(callback);
        },
        addToComponentDidUpdate: callback => {
          if (!initialPhase) preventUseHooksInRender();
          this._componentDidUpdateHooks.add(callback);
        },
        addToComponentWillUnmount: callback => {
          if (!initialPhase) preventUseHooksInRender();
          this._componentWillUnmountHooks.add(callback);
        },
      };

      const hooksGetter = cb => {
        // debug
        this.state.used.push(cb.name || cb.toString());
        return cb(hooks);
      };

      this._render = renderCreator(hooksGetter, props, context);

      initialPhase = false;
    }
    componentDidMount() {
      this._componentDidMountHooks.forEach(this._contextExecutor);
    }
    getSnapshotBeforeUpdate() {
      this._getSnapshotBeforeUpdateHooks.forEach(this._contextExecutor);
      return null;
    }
    componentDidUpdate() {
      this._componentDidUpdateHooks.forEach(this._contextExecutor);
    }
    componentWillUnmount() {
      this._componentWillUnmountHooks.forEach(this._contextExecutor);
    }
    render() {
      return this._render(this.props);
    }
  };
}
