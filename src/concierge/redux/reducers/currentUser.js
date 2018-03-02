import { CURRENT_USER_FETCHED, CURRENT_USER_LOADING } from '../actionTypes';

export const initialState = {
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CURRENT_USER_FETCHED:
        case CURRENT_USER_LOADING: {
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
