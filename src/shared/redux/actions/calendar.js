import moment from 'moment';

import {
    CURRENT_EVENTS_FETCHED,
    CURRENT_SELECTED_EVENT,
    SET_SHARE_EVENTS
} from '../actionTypes';

import {
    localRequest,
    generateHttpOptions,
    handleHttpError,
} from '../../utils/http';

const uri = '/calendar';

export function setSelectedEvent(payload) {
    return {
        type: CURRENT_SELECTED_EVENT,
        payload
    };
}

export function setShareEvents(payload) {
    return {
        type: SET_SHARE_EVENTS,
        payload
    };
}

export function setCurrentEvents(payload) {
    return {
        type: CURRENT_EVENTS_FETCHED,
        payload
    };
}

export function fetchEvents() {
    const fetchEventsDispatch = async (dispatch) => {
        try {
            let fetchResponse = await localRequest(`${uri}/events`, generateHttpOptions({
                method: 'GET',
            }));

            fetchResponse = fetchResponse.map((event) => {
                const { startDate, endDate, startTime, endTime } = event;

                event.allDay = !!(startDate && endDate);
                event.start = new Date(startTime || startDate);
                event.end = new Date(endTime || moment(endDate).subtract(1, 'seconds'));
                return event;
            });

            dispatch(setCurrentEvents(fetchResponse));
        } catch (error) {
            await handleHttpError(error, '/api/concierge/refresh');

            await fetchEventsDispatch(dispatch);
        }
    };

    return fetchEventsDispatch;
}