import {
    CURRENT_EMITTER_SET,
    CURRENT_EMITTER_ERROR,
    CURRENT_EMITTER_CREATING,
    CURRENT_PEER_SET
} from '../actionTypes';

export const initialState = { creating: false };

export default function (state = initialState, { type, payload }) {
    switch (type) {
        case CURRENT_EMITTER_SET: {
            return {
                ...state,
                emitter: payload,
                creating: false
            };
        }

        case CURRENT_EMITTER_ERROR: {
            return {
                ...state,
                error: payload
            };
        }

        case CURRENT_EMITTER_CREATING: {
            return {
                ...state,
                creating: true
            };
        }

        case CURRENT_PEER_SET: {
            return {
                ...state,
                peer: payload
            };
        }


        default: {
            return state;
        }
    }
}
