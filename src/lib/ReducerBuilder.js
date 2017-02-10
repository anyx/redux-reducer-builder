const ActionTypes = {
    INIT: '@@redux/INIT'
};

function getUndefinedStateErrorMessage(key, action) {
    let actionType = action && action.type;
    let actionName = actionType && `"${actionType.toString()}"`;

    if (!actionName) {
        actionName = 'unknown action';
    }

    return (
        `Given action ${actionName}, reducer "${key}" returned undefined. ` +
        'To ignore an action, you must explicitly return the previous state.'
    );
}

function assertReducerSanity(reducersMap) {
    reducersMap.forEach((reducerConfig) => {
        let key = reducerConfig.key;
        let reducer = reducerConfig.reducer;
        let initialState = reducer(undefined, {type: ActionTypes.INIT});

        if (typeof initialState === 'undefined') {
            throw new Error(
                `Reducer "${key ? key : '__GLOBAL__'}" returned undefined during initialization. ` +
                'If the state passed to the reducer is undefined, you must ' +
                'explicitly return the initial state. The initial state may ' +
                'not be undefined.'
            );
        }

        let type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
        if (typeof reducer(undefined, {type}) === 'undefined') {
            throw new Error(
                `Reducer "${key}" returned undefined when probed with a random type. ` +
                `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
                'namespace. They are considered private. Instead, you must return the ' +
                'current state for any unknown actions, unless it is undefined, ' +
                'in which case you must return the initial state, regardless of the ' +
                'action type. The initial state may not be undefined.'
            );
        }
    });
}

let reducersMap = [];

export default class ReducerBuilder {

    constructor() {
        reducersMap = [];
    }

    registerReducer(reducer, stateKey, initialState = {}) {
        reducersMap.push({
            key: stateKey,
            reducer: reducer,
            initialState: initialState
        });

        return this;
    }

    build() {
        let sanityError;
        try {
            assertReducerSanity(reducersMap);
        } catch (e) {
            sanityError = e;
        }

        let globalReducers = reducersMap.filter(reducerMap => !reducerMap.key);
        let internalReducers = reducersMap.filter(reducerMap => reducerMap.key);

        return function combination(state = {}, action) {
            if (sanityError) {
                throw sanityError;
            }

            let nextState = state;
            for (let i = 0; i < globalReducers.length; i++) {
                let reducer = globalReducers[i].reducer;
                nextState = reducer(nextState, action);

                if (!nextState) {
                    throw new Error(`Looks like reducer for action "${action.type}" did not return a new state`);
                }
            }

            for (let i = 0; i < internalReducers.length; i++) {
                let key = internalReducers[i].key;
                let reducer = internalReducers[i].reducer;

                let previousStateForKey = nextState[key];
                let nextStateForKey = reducer(previousStateForKey, action);

                if (typeof nextStateForKey === 'undefined') {
                    let errorMessage = getUndefinedStateErrorMessage(key, action);
                    throw new Error(errorMessage);
                }

                if (previousStateForKey !== nextStateForKey) {
                    nextState[key] = nextStateForKey;
                    nextState = {...nextState};
                }
            }

            return nextState;
        };
    }
}
