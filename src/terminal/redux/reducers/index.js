import { reducer as formReducer } from 'redux-form';
import currentUser from './currentUser';
import currentPeer from './peerConnection';

export default {
    currentPeer,
    currentUser,
    form: formReducer
};