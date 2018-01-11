import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { bindActionCreators } from 'redux';

import { store, history } from './utils/store';
import { fetchCurrentUser } from './redux/actions/user';

import { Login, Dashboard } from './containers/';

// #region ProtectedRoute 

const ProtectedRouteComponent = (props) => {
    const {
        currentUser,
        path,
        component,
        fetchCurrentUserDispatch
    } = props;

    if (!window.sessionStorage.getItem('authToken')) {
        return <Redirect exact from={path} to='/login' />;
    }

    if (!currentUser || !currentUser.id) {
        fetchCurrentUserDispatch();
    }

    return <Route path={path} component={component} />;
};

ProtectedRouteComponent.propTypes = {
    path: PropTypes.string.isRequired,
    currentUser: PropTypes.shape({
        id: PropTypes.string,
    }).isRequired,
    component: PropTypes.func.isRequired,
    fetchCurrentUserDispatch: PropTypes.func.isRequired
};

function mapStoreToProps(store) {
    return {
        currentUser: store.currentUser
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchCurrentUserDispatch: fetchCurrentUser
    }, dispatch);
}

const ProtectedRoute = connect(mapStoreToProps, mapDispatchToProps)(ProtectedRouteComponent);

// #endregion

// #region Router
const Router = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Fragment>
                <Switch>
                    <Redirect exact from='/' to='/dashboard' />

                    <ProtectedRoute 
                        path='/dashboard' 
                        component={Dashboard}
                    />
                    <Route path='/login' component={Login} />
                </Switch>
                {/* <Notifications /> */}
            </Fragment>
        </ConnectedRouter>
    </Provider>
);

export default Router;
// #endregion
