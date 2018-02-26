import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, history, setReducers } from '../shared/utils/store';

import reducers from './redux/reducers';

import { ProtectedRoute } from '../shared/components/';

import Main from './containers/Main/';
import Start from './containers/Start/';
import Login from './containers/Login';
import Call from './containers/Video/';
import Rate from './containers/Rate/';

require('./index.global.scss');

setReducers(reducers);

const Router = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Main>
                <Switch>
                    <Redirect exact from='/' to='/start' />

                    <ProtectedRoute
                        path='/start'
                        component={Start}
                    />
                    <ProtectedRoute
                        path='/call'
                        component={Call}
                    />
                    <ProtectedRoute
                        path='/rate'
                        component={Rate}
                    />
                    <Route path='/login' component={Login} />
                </Switch>
            </Main>
            {/* <Notifications /> */}
        </ConnectedRouter>
    </Provider>
);

export default Router;
