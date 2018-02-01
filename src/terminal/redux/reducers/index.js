import { reducer as formReducer } from 'redux-form';
import currentUser from './currentUser';
import stream from './stream';

export default {
    streams: stream,
    currentUser,
    form: formReducer
};