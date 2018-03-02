import {
} from '../actionTypes';

import sharedReducer from '../../../shared/redux/reducers/peerConnection';

export const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        default: {
            return sharedReducer(state, action);
        }
    }
}
