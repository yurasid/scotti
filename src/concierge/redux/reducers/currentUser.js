import { SET_CURRENT_USER } from '../actionTypes';

export const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER: {
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
