export function createState(initialState) {
    return function createState(hooks) {
        return hooks.createState(initialState)
    }
}

export function createEffect(cb) {
    return function createEffect(hooks) {
        hooks.addToComponentDidUpdate(cb)
    }
}

export function createSubscriber(subscribe) {
    return function createSubscriber(hooks) {
        let unsubscribe;
        hooks.addToComponentDidMount(() => { unsubscribe = subscribe() })
        hooks.addToComponentWillUnmount(() => { unsubscribe() })
    }
}