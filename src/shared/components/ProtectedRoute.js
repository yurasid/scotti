import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = (props) => {
    const {
        path,
        component,
        redirectPath
    } = props;

    if (!window.sessionStorage.getItem('authToken')) {
        return <Redirect exact from={path} to={redirectPath} />;
    }

    return <Route path={path} component={component} />;
};

ProtectedRoute.propTypes = {
    path: PropTypes.string.isRequired,
    redirectPath: PropTypes.string,
    component: PropTypes.func.isRequired
};

ProtectedRoute.defaultProps = {
    redirectPath: '/login'
};

export default ProtectedRoute;

