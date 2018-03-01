
import { UPDATE_RETRIES } from '../actionTypes';

import {
    localRequest,
    generateHttpOptions,
} from '../../../shared/utils/http';


const uri = '/api/terminal';

export function login(data) {
    return async () => {
        try {
            const fetchResponse = await localRequest(`${uri}/login`, generateHttpOptions({
                method: 'POST',
                body: JSON.stringify(data),
            }));

            window.sessionStorage.setItem('authToken', fetchResponse['access_token']);
        } catch (error) {
            throw error;
        }
    };
}

export function updateLoginRetries(props) {
    const payload = {};
    const {
        tries = 0,
        timeout = 1000,
        timeoutError = 10000,
        maxTries = 5
    } = props;

    props.hasOwnProperty('tries') && (payload.tries = tries);
    props.hasOwnProperty('timeout') && (payload.retryTimeout = timeout);
    props.hasOwnProperty('timeoutError') && timeoutError <= 640000 && (payload.timeoutError = timeoutError);
    props.hasOwnProperty('maxTries') && (payload.maxTries = maxTries);

    return {
        type: UPDATE_RETRIES,
        payload
    };
}
