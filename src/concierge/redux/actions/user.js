import { CURRENT_USER_FETCHED, CURRENT_USER_LOADING } from '../actionTypes';
import {
    localRequest,
    generateHttpOptions,
    checkHttpStatus,
    handleHttpError,
} from '../../../shared/utils/http';

const uri = '/api/concierge';

export function currentUserLoadingStatus(state) {
    return {
        type: CURRENT_USER_LOADING,
        payload: {
            loading: !!state
        }
    };
}

export function setCurrentUser(data) {
    return {
        type: CURRENT_USER_FETCHED,
        payload: { ...data, loading: false }
    };
}

export function fetchCurrentUser() {
    const fetchCurrentUserDispatch = async (dispatch) => {
        try {
            const fetchResponse = await localRequest(`${uri}/me`, generateHttpOptions({
                method: 'GET',
            }));

            dispatch(setCurrentUser(fetchResponse));
        } catch (error) {
            await handleHttpError(error, `${uri}/refresh`);

            await fetchCurrentUserDispatch(dispatch);
        }
    };

    return fetchCurrentUserDispatch;
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
