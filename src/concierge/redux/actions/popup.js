import { CURRENT_POPUP_SET } from '../actionTypes';

export default function setCurrentPopup(popup) {
    return {
        type: CURRENT_POPUP_SET,
        payload: popup
    };
}