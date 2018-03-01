import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { ProtectedRoute } from '../shared/components/';

import Main from './containers/Main/';
import Start from './containers/Start/';
import Login from './containers/Login';
import ErrorContainer from './containers/Error/';
import Call from './containers/Video/';
import Rate from './containers/Rate/';

require('./index.global.scss');

const Router = () => (
    <Fragment>
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
                <Route path='/error' component={ErrorContainer} />
            </Switch>
        </Main>
        {/* <Notifications /> */}
    </Fragment>
);

export default Router;
