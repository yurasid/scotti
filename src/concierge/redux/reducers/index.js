import { reducer as formReducer } from 'redux-form';
import currentUser from './currentUser';
import currentPopup from './popup';

export default {
    currentPopup,
    currentUser,
    form: formReducer
};