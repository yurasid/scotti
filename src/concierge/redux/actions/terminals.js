import {
    CURRENT_TERMINAL_FETCHED,
    TERMINALS_FETCHED
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

export function setTerminals(data) {
    return {
        type: TERMINALS_FETCHED,
        payload: { all: data }
    };
}

export function fetchTerminals() {
    function mapResponse(response) {
        const data = response.data || response;
        /* const mapped = {};
        const arrayForMap = Array.isArray(data) ? data : [data];

        arrayForMap.map((item) => {
            const id = item.id;

            if (id) {
                mapped[id] = item;
            }
        }); */

        return data;
    }

    const fetchTerminalsDispatch = async (dispatch) => {
        try {
            const fetchResponse = await localRequest(`${uri}/terminals`, generateHttpOptions({
                method: 'GET',
            }));

            dispatch(setTerminals(mapResponse(fetchResponse)));
        } catch (error) {
            await handleHttpError(error, `${uri}/refresh`);

            await fetchTerminalsDispatch(dispatch);
        }
    };

    return fetchTerminalsDispatch;
}

export function updateTerminalStatus({ id, status }) {
    return function (dispatch, getState) {
        if (id) {
            const { terminals: { all: prevCollection}} = getState();

            const newCollection = prevCollection.map((terminal) => {
                terminal.id === id && (terminal.is_enabled = !!status);

                return terminal;
            });

            dispatch(setTerminals(newCollection));
        }
    };
}