import { reducer as formReducer } from 'redux-form';
import currentUser from './currentUser';
import currentPopup from './popup';
import currentPeer from './peerConnection';
import terminals from './terminals';
import calendar from '../../../shared/redux/reducers/calendar';

export default {
    currentPeer,
    currentPopup,
    currentUser,
    terminals,
    form: formReducer,
    calendar
};