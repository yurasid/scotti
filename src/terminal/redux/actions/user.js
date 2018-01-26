import { CURRENT_USER_FETCHED } from '../actionTypes';
import {
    localRequest,
    generateHttpOptions,
    checkHttpStatus,
    handleHttpError,
} from '../../../shared/utils/http';

const uri = '/api/user';

export function setCurrentUser(data) {
    return {
        type: CURRENT_USER_FETCHED,
        payload: data,
    };
}

export function fetchCurrentUser() {
    return () => Promise.resolve();

    /* return (dispatch, getState, history) => localRequest(`${uri}/current`, generateHttpOptions({
        method: 'GET',
    }))
        .then(checkHttpStatus)
        .then(response => response.json())
        .then(user => dispatch(setCurrentUser(user)))
        .catch(() => history.push('/login')); */
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
