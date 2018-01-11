import { SET_CURRENT_USER } from '../actionTypes';
import {
    localRequest,
    generateHttpOptions,
    checkHttpStatus,
    handleHttpError,
} from '../../../shared/services/http';

const uri = '/api/user';

export function setCurrentUser(data) {
    return {
        type: SET_CURRENT_USER,
        payload: data,
    };
}

export function isAuthenticated() {
    return (dispatch, getState, history) => localRequest(`${uri}/current`, generateHttpOptions({
        method: 'GET',
    }))
        .then(checkHttpStatus)
        .then(response => response.json())
        .then(user => dispatch(setCurrentUser(user)))
        .catch(() => history.push('/login'));
}

export function fetchCurrentUser() {
    return () => Promise.resolve();

    return (dispatch, getState, history) => localRequest(`${uri}/current`, generateHttpOptions({
        method: 'GET',
    }))
        .then(checkHttpStatus)
        .then(response => response.json())
        .then(user => dispatch(setCurrentUser(user)))
        .catch(() => history.push('/login'));
}

export function changePass(data) {
    return () => localRequest(`${uri}/changePass`, generateHttpOptions({
        method: 'PATCH',
        body: JSON.stringify(data),
    }))
        .then(checkHttpStatus)
        // .then(dispatch(addNotification({ type: 'updated' })))
        .catch(err => handleHttpError(err/* , dispatch, addNotification */));
}
