import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { Provider } from 'react-redux';
import { store, history, setReducers } from '../shared/utils/store';

import reducers from './redux/reducers';

import { ProtectedRoute } from '../shared/components/';

import Main from './containers/Main/';
import Start from './containers/Start/';
import Login from './containers/Login';
import Call from './containers/Video';

require('./index.global.scss');

defineMessages({
    connecting: {
        id: 'Main.call.connecting',
        defaultMessage: 'connecting...'
    },
    wait: {
        id: 'Main.call.connecting.wait',
        defaultMessage: 'please wait for a moment'
    },
    hangUp: {
        id: 'Main.call.hangUp',
        defaultMessage: 'Hang up'
    },
    hideVideo: {
        id: 'Main.call.hideVideo',
        defaultMessage: 'Hide video'
    },
    showVideo: {
        id: 'Main.call.showVideo',
        defaultMessage: 'Show video'
    },
    disabledVideo: {
        id: 'Main.call.disabledVideo',
        defaultMessage: 'Your video is disabled at the moment'
    },
    holdOn: {
        id: 'Main.call.holdOn',
        defaultMessage: 'Hold on please'
    },
    holdOnConnect: {
        id: 'Main.call.holdOnConnect',
        defaultMessage: 'Your will be connected in a few moments'
    },
    satisgied: {
        id: 'Main.afterCall.satisgied',
        defaultMessage: 'Are You satisfied with our service?'
    },
    yesButton: {
        id: 'Main.yesButton',
        defaultMessage: 'Yes'
    },
    noButton: {
        id: 'Main.noButton',
        defaultMessage: 'No'
    },
    thankYou: {
        id: 'Main.afterCall.thankYou',
        defaultMessage: 'Thank You!'
    },
    thankYouService: {
        id: 'Main.afterCall.thankYouService',
        defaultMessage: 'Thank You for using our service!'
    },
    opinion: {
        id: 'Main.afterCall.thankYou.opinion',
        defaultMessage: 'your opinion  is very important to us'
    },
    glad: {
        id: 'Main.afterCall.thankYouService.glad',
        defaultMessage: 'we are always glad to help you'
    },
    rate: {
        id: 'Main.afterCall.rate',
        defaultMessage: 'Please rate Your concierge'
    }
});

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
                    <Route path='/login' component={Login} />
                </Switch>
            </Main>
            {/* <Notifications /> */}
        </ConnectedRouter>
    </Provider>
);

export default Router;
