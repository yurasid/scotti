import { setCurrentUser } from './user';
// import { addNotification } from './notifications';

import {
    localRequest,
    generateHttpOptions,
    checkHttpStatus,
    handleHttpError,
} from '../../../shared/services/http';


const uri = '/api/logIn';

export default function login(data) {
    return (dispatch) => {
        window.sessionStorage.setItem('authToken', 'sdsdsdsd');
        dispatch(setCurrentUser({
            name: data.username
        }));
        return Promise.resolve();
    };

    return (dispatch) => localRequest(uri, generateHttpOptions({
        method: 'POST',
        body: JSON.stringify(data),
    }))
        .then(checkHttpStatus)
        .then(response => response.json())
        .then((user) => {
            dispatch(setCurrentUser(user));
            // push('/');
        })
        .catch(err => handleHttpError(err/* , dispatch, addNotification */));
}
