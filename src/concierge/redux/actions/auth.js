import { setCurrentUser } from './user';
// import { addNotification } from './notifications';

import {
    localRequest,
    generateHttpOptions
} from '../../../shared/utils/http';

const uri = '/api/concierge';

export function login(data) {
    return async () => {
        try {
            const fetchResponse = await localRequest(`${uri}/login`, generateHttpOptions({
                method: 'POST',
                body: JSON.stringify(data),
            }));

            window.sessionStorage.setItem('authToken', fetchResponse['access_token']);
            window.sessionStorage.setItem('refreshToken', fetchResponse['refresh_token']);
        } catch (error) {
            throw error;
        }
    };
}

export function logout() {
    function logOutCb(dispatch) {
        dispatch(setCurrentUser({}));

        window.sessionStorage.removeItem('authToken');
        window.sessionStorage.removeItem('refreshToken');
    }

    return async (dispatch) => {
        try {
            await localRequest(`${uri}/logout`, generateHttpOptions({
                method: 'POST'
            }));

            return logOutCb(dispatch);
        } catch (error) {
            return logOutCb(dispatch);
        }

    };
}
