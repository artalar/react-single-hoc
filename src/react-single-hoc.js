import React from "react";

function preventUseHooksInRender() {
  throw new Error("You can not use hooks outside initial phase");
}

const context = React.createContext({});

export const Provider = context.Provider;

export function withHooks(renderCreator) {
  return class HooksController extends React.Component {
    // TODO: downgrade?
    static contextType = context.Consumer;

    constructor(props, context) {
      super(props, context);

      this._effects = [];
      this._subscribers = [];
      this._unsubscribers = [];
      this.state = {};
      const stateUpdaters = [];
      const stateUpdateSubscribers = [];
      let stateObserverId = 0;
      function updateState(state) {
        try {
          const newState = stateUpdaters.reduce(
            (acc, update) => Object.assign(acc, update(acc)),
            Object.assign({}, state)
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

      const use = {
        returnInitial: () => ({ props, context }),
        state: initialState => {
          const id = stateObserverId++;
          this.state[id] = initialState;
          return {
            get: () => this.state[id],
            set: (update, cb) => {
              const updateCallback =
                typeof update === "function" ? update : () => update;
              stateUpdaters.push(state => ({
                [id]: updateCallback(state[id])
              }));
              if (cb) stateUpdateSubscribers.push(cb);
              startUpdateState();
            }
          };
        },
        effect: cb => {
          this._effects.push(cb);
        },
        subscribe: subscriber => this._subscribers.push(subscriber)
      };
      this._render = renderCreator(use, props, context);

      use.returnInitial = use.state = use.effect = use.subscribe = preventUseHooksInRender;
    }
    componentDidMount() {
      this._unsubscribers = this._subscribers.map(cb =>
        cb(this.props, this.context)
      );
      // TODO: this is really needed?
      this._effects.forEach(cb => cb(this.props, this.context));
    }
    componentDidUpdate() {
      this._effects.forEach(cb => cb(this.props, this.context));
    }
    componentWillUnmount() {
      this._unsubscribers.forEach(cb => cb(this.props, this.context));
    }
    render() {
      return this._render(this.props);
    }
  };
}
