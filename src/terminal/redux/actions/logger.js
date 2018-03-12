
import {
    localRequest,
    generateHttpOptions,
} from '../../../shared/utils/http';


const uri = '/logger';

export function logError(message) {
    return async () => {
        try {
            await localRequest(uri, generateHttpOptions({
                method: 'POST',
                body: JSON.stringify({ level: 'error', message }),
            }));
        } catch (error) {
            throw error;
        }
    };
}

export function logWarn(message) {
    return async () => {
        try {
            await localRequest(uri, generateHttpOptions({
                method: 'POST',
                body: JSON.stringify({ level: 'warn', message }),
            }));
        } catch (error) {
            throw error;
        }
    };
}

export function logSuccess(message) {
    return async () => {
        try {
            await localRequest(uri, generateHttpOptions({
                method: 'POST',
                body: JSON.stringify({ level: 'info', message }),
            }));
        } catch (error) {
            throw error;
        }
    };
}
