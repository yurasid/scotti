import { reducer as formReducer } from 'redux-form';
import currentUser from './currentUser';

export default {
    currentUser,
    form: formReducer
};