import {
    CURRENT_TERMINAL_FETCHED
} from '../actionTypes';

import {
    localRequest,
    generateHttpOptions,
    handleHttpError,
} from '../../../shared/utils/http';

const uri = '/api/concierge';

export function setCurrentTerminal(data) {
    return {
        type: CURRENT_TERMINAL_FETCHED,
        payload: { currentTerminal: data }
    };
}

export function fetchCurrentTerminal(id) {
    const fetchTerminalDispatch = async (dispatch) => {
        try {
            const fetchResponse = await localRequest(`${uri}/terminals/${id}`, generateHttpOptions({
                method: 'GET',
            }));

            dispatch(setCurrentTerminal(fetchResponse));
        } catch (error) {
            await handleHttpError(error, `${uri}/refresh`);

            await fetchTerminalDispatch(dispatch);
        }
    };

    return fetchTerminalDispatch;
}