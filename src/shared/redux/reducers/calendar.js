import {
    CURRENT_EVENTS_FETCHED,
    CURRENT_SELECTED_EVENT
} from '../actionTypes';

export const initialState = { events: [], event: null };

export default function (state = initialState, { type, payload }) {
    switch (type) {
        case CURRENT_EVENTS_FETCHED: {
            return {
                ...state,
                events: payload
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
