import { reducer as formReducer } from 'redux-form';
import currentUser from './currentUser';
import currentPeer from './peerConnection';
import loginTries from './loginTries';

export default {
    currentPeer,
    currentUser,
    form: formReducer,
    loginTries
};