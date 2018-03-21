import { merge } from 'lodash';

const FETCH_DEFAULT_OPTIONS = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
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
    return (error.response && error.response.status === 401) || error.code === 401;
}

export async function handleHttpError(error, refreshUrl) {
    const refreshToken = window.sessionStorage.getItem('refreshToken');

    if (isUnauthorized(error) && refreshToken && refreshToken !== 'undefined' && refreshUrl) {
        const refreshResponse = await localRequest(refreshUrl, generateHttpOptions({
            method: 'POST',
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        }));

        window.sessionStorage.setItem('authToken', refreshResponse['access_token']);
        window.sessionStorage.setItem('refreshToken', refreshResponse['refresh_token']);

        return true;
    }

    throw error;
}

export async function localRequest(uri, options) {
    let url = uri;

    if (typeof window === 'undefined') {
        url = `http://localhost:5000${uri}`;
    }

    try {
        let fetchResponse = await fetch(url, options);

        fetchResponse = checkHttpStatus(fetchResponse);
        fetchResponse && (fetchResponse = await fetchResponse.json());

        return fetchResponse;
    } catch (error) {
        throw error;
    }
}

export function generateHttpOptions(mergeOptions, sameOrigin = true) {
    const startObject = {
        headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem('authToken')}`
        }
    };

    if (sameOrigin) {
        startObject.credentials = 'same-origin';
    }


    return merge(startObject, FETCH_DEFAULT_OPTIONS, mergeOptions);
}
