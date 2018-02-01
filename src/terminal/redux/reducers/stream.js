import { SET_REMOTE_STREAM, SET_LOCAL_STREAM } from '../actionTypes';

export const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_REMOTE_STREAM:
        case SET_LOCAL_STREAM: {
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
