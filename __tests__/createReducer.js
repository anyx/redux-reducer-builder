import createReducer from '../src/lib/createReducer';

describe('create reducer', () => {

    let initialState = {
        stateKey: 'value'
    };

    it('reducer should return a new state when action was not registered', () => {
        let reducersMap = {};

        let reducer = createReducer(reducersMap);
        let action = {type: 'SOME_ACTION'};

        let nextState = reducer(initialState, action);

        expect(nextState).not.toBe(initialState);
        expect(nextState).toEqual(initialState);
    });

    it('reducer should return a new state after run action', () => {
        let actionType = 'SET_NUMBER';

        let reducersMap = {
            [actionType]: (state, action) => {
                return {...state, stateKey: action.number};
            }
        };

        let reducer = createReducer(reducersMap);
        let action = {type: actionType, number: 7};

        let nextState = reducer(initialState, action);

        expect(nextState).not.toBe(initialState);
        expect(nextState).toEqual({stateKey: 7});
    });
});
