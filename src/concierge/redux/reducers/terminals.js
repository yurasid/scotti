import { CURRENT_TERMINAL_FETCHED, TERMINALS_FETCHED } from '../actionTypes';

export const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case TERMINALS_FETCHED:
        case CURRENT_TERMINAL_FETCHED: {
            return {
                ...state,
                ...action.payload
            };
        }

        default: {
            return state;
        }
    }
}
