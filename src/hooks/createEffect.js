/**
 * @param {(props, context) => void} callback - will calls at every `componentDidUpdate`
 */
export function createEffect(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('@@react-single-hoc: effect callback must be function');
  }
  return function effect(hooks) {
    hooks.addToComponentDidUpdate(callback);
  };
}
