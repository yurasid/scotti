import {
    LOCAL_STREEM_SET,
    REMOTE_STREEM_SET,
    CURRENT_FILE_SET,
    CURRENT_FILE_SET_ERROR
} from '../actionTypes';

import sharedReducer from '../../../shared/redux/reducers/peerConnection';

export const initialState = {
    fileError: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOCAL_STREEM_SET:
        case CURRENT_FILE_SET:
        case CURRENT_FILE_SET_ERROR:
        case REMOTE_STREEM_SET: {
            return {
                ...state,
                ...action.payload
            };
        }

        default: {
            return sharedReducer(state, action);
        }
    }
}
