import { UPDATE_RETRIES } from '../actionTypes';

export const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_RETRIES: {
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
