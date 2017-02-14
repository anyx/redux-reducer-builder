
## Redux reducer builder

Inspired by [redux-module-builder](https://github.com/fullstackreact/redux-modules)

Represent redux root reducer builder exactly like [combineReducers](http://redux.js.org/docs/api/combineReducers.html),
but with opportunity to create _root_ modules who have access to another modules

## Example

```javascript
import {ReducerBuilder, createReducer} from 'redux-reducer-builder';
let reducerBuilder = new ReducerBuilder();

const initialSecurityState = {
    user: undefined   
};

const securityReducer = createReducer({
    'LOGIN': (state, action) => {
        return {...state, user: action.user}
    }    
});

//third parameter defines state key for reducer
reducerBuilder.registerReducer(securityReducer, initialSecurityState, 'security');

const globalReducer = createReducer({
    'RESET_ALL': (state, action) => {
        return {...state, security: {user: undefined}}
    }    
});

//register without third parameter marks reducer as global
reducerBuilder.registerReducer(globalReducer);

exports default reducerBuilder.build();
```

That's all for now

More information you can get in [tests](/__tests__)

## License
[MIT](/LICENSE)
