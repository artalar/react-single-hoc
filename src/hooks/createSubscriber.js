function noop() {}
/**
 * @param {(props, context) => () => {}} callback - will call at `componentDidMount`, [optional] returned function will call at `componentWillUnmount`
 */
export function createSubscriber(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError(
      '@@react-single-hoc: subscriber callback must be function',
    );
  }
  return function subscriber(hooks) {
    let unsubscribe = noop;
    hooks.addToComponentDidMount(() => {
      unsubscribe = callback();
      if (typeof unsubscribe !== 'undefined') {
        if (typeof unsubscribe !== 'function') {
          throw new TypeError(
            '@@react-single-hoc: subscriber callback may return only function or nothing',
          );
        }
      } else {
        unsubscribe = noop;
      }
    });
    hooks.addToComponentWillUnmount(() => {
      unsubscribe();
    });
  };
}
