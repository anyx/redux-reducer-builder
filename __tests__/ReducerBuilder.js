import ReducerBuilder from '../src/lib/ReducerBuilder';
import createReducer from '../src/lib/createReducer';

const ACTION_CLEAR_ALL = 'CLEAR_ALL';
const ACTION_SET_USER = 'SET_USER';

describe('ReducerBuilder', () => {

    let initialState = {};

    let modules = {
        user: {
            initialState: {
                email: undefined
            },
            reducer: createReducer({
                [ACTION_SET_USER]: (state, action) => {
                    return {...state, email: action.user}
                }
            })
        }
    };

    it('should build global reducer', () => {
        let builder = new ReducerBuilder();

        let globalReducer = createReducer({
            [ACTION_CLEAR_ALL]: (state, action) => {
                return {...state, user: {}};
            }
        });

        builder.registerReducer(globalReducer);
        builder.registerReducer(modules.user.reducer, 'user', modules.user.initialState);

        let reducer = builder.build();

        let firstAction = {type: ACTION_SET_USER, user: 'user@example.com'};
        let stateAfterFirstAction = reducer(initialState, firstAction);

        expect(stateAfterFirstAction).toEqual({
            user: {
                email: 'user@example.com'
            }
        });

        let secondAction = {type: ACTION_CLEAR_ALL};
        let stateAfterSecondAction = reducer(stateAfterFirstAction, secondAction);

        expect(stateAfterSecondAction).toEqual({
            user: {}
        });
    });
});
