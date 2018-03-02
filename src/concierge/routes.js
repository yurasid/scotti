import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { initValidationMessages } from '../shared/utils/validation';
import { ProtectedRoute } from '../shared/components/';

import { Login, Dashboard } from './containers/';

const validationMessages = defineMessages({
    required: {
        id: 'Validation.error.required',
        defaultMessage: 'Required'
    },
    /* password: {
        id: 'Validation.error.password',
        defaultMessage: 'Must be more than 4 but less then 10 characters and contains at least one uppercase and lowercase letters and symbol from: "$@$!%*?&"'
    }, */
    maxLength: {
        id: 'Validation.error.maxValue',
        defaultMessage: 'Must be {max} characters or less'
    },
    minLength: {
        id: 'Validation.error.minValue',
        defaultMessage: 'Must be at least {min} characters'
    }
});

const Router = () => {
    initValidationMessages(validationMessages);

    return (
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
    );
};

export default Router;
