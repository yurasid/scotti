import {
    CURRENT_PEER_SET,
    LOCAL_STREEM_SET,
    REMOTE_STREEM_SET
} from '../actionTypes';

export const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOCAL_STREEM_SET:
        case REMOTE_STREEM_SET:
        case CURRENT_PEER_SET: {
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
