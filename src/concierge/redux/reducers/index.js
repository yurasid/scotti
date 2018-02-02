import { reducer as formReducer } from 'redux-form';
import currentUser from './currentUser';
import currentPopup from './popup';
import currentPeer from './peerConnection';

export default {
    currentPeer,
    currentPopup,
    currentUser,
    form: formReducer
};