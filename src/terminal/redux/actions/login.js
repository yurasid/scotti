
// import { addNotification } from './notifications';

import {
    localRequest,
    generateHttpOptions,
} from '../../../shared/utils/http';


const uri = '/api/terminal';

export default function login(data) {
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
