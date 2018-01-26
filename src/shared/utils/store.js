import { createBrowserHistory } from 'history';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createBrowserHistory();

const extendedReducers = Object.assign({}, {
    router: routerReducer,
});

const store = createStore(
    combineReducers(extendedReducers),
    composeEnhancers(
        applyMiddleware(
            thunkMiddleware.withExtraArgument(history),
            createLogger(),
            routerMiddleware(history)
        )
    ),
);

export {
    history,
    store
};

export const setReducers = (reducers = {}) => {
    const nextExtendedReducer = Object.assign({}, reducers, extendedReducers);

    store.replaceReducer(combineReducers(nextExtendedReducer));
};
