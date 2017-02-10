export default function createReducer(actionHandlers) {
    let initialState = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return function () {
        let state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
        let action = arguments[1];

        let handler = actionHandlers[action.type];

        let newState;
        if (handler) {
            newState = handler(state, action);
        } else {
            newState = {...initialState, ...state};
        }

        return newState;
    };
}
