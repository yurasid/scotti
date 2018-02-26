import { CURRENT_TERMINAL_FETCHED } from '../actionTypes';

export const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
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
