import { merge } from 'lodash';
import { push } from 'react-router-redux';

const FETCH_DEFAULT_OPTIONS = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export function isUnauthorized(error) {
    return error.response && error.response.status === 401;
}

export function sendToLogin(dispatch) {
    dispatch(push('/login'));
}

export function handleHttpError(error, dispatch, errorAction) {
    if (isUnauthorized(error)) {
        sendToLogin(dispatch);
    } else if (typeof dispatch === 'function' && typeof errorAction === 'function') {
        const data = {
            text: error.message,
            type: 'error',
        };

        dispatch(errorAction(data));
    }
}

export function localRequest(uri, options) {
    let url = uri;

    if (typeof window === 'undefined') {
        url = `http://localhost:5000${uri}`;
    }

    return fetch(url, options);
}

export function generateHttpOptions(mergeOptions, sameOrigin = true) {
    const startObject = {};

    if (sameOrigin) {
        startObject.credentials = 'same-origin';
    }

    return merge(startObject, FETCH_DEFAULT_OPTIONS, mergeOptions);
}
