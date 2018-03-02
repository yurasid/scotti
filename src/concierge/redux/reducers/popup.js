import { CURRENT_POPUP_SET } from '../actionTypes';

export default function(state=null, action) {
    switch (action.type) {
        case CURRENT_POPUP_SET: {
            return action.payload;
        }

        default: {
            return state;
        }
    }
}