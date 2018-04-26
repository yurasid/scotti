import {
    CURRENT_EVENTS_FETCHED,
    CURRENT_SELECTED_EVENT,
    SET_SHARE_EVENTS
} from '../actionTypes';

export const initialState = {
    events: [],
    event: null,
    shareEvents: []
};

export default function (state = initialState, { type, payload }) {
    switch (type) {
        case CURRENT_EVENTS_FETCHED: {
            return {
                ...state,
                events: payload
            };
        }

        case SET_SHARE_EVENTS: {
            return {
                ...state,
                shareEvents: payload
            };
        }

        case CURRENT_SELECTED_EVENT: {
            return {
                ...state,
                event: payload
            };
        }

        default: {
            return state;
        }
    }
}
