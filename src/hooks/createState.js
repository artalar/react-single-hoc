/**
 * create new local state;
 * @param {any} initialState
 * @returns {{ get(){ return state }, set(newState){} }}
 */
export function createState(initialState) {
  return function state(hooks) {
    return hooks.createState(initialState);
  };
}
