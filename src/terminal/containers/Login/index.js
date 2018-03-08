import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { login, updateLoginRetries } from '../../redux/actions/login';
import { fetchCurrentUser } from '../../redux/actions/user';
import { setCurrentEmitter } from '../../redux/actions/peerConnection';
import { logError } from '../../redux/actions/logger';

import { Loader } from '../../../shared/components/';
import NotAvailable from './components/notAvailable';

import styles from './index.scss';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            tries: 0
        };
    }

    login = async () => {
        const {
            emitter,
            loginDispatch,
            fetchCurrentUserDispatch,
            setCurrentEmitterDispatch,
            updateLoginRetriesDispatch,
            logErrorDispatch,
            loginTries: {
                tries,
                timeoutError,
                maxTries
            },
            history
        } = this.props;

        try {
            emitter && emitter.close() && await setCurrentEmitterDispatch(null);

            await loginDispatch({
                'uid': 'f884ecec-70c6-352d-9fd7-e56a818a2826',
                'password': 'secret'
            });
            await fetchCurrentUserDispatch();

            return history.push('/');
        } catch (error) {
            if (tries !== maxTries) {
                return updateLoginRetriesDispatch({ tries: tries + 1 });
            }

            logErrorDispatch(error.toString());

            return this.timeout = setTimeout(() => {
                return updateLoginRetriesDispatch({
                    tries: 0,
                    maxTries: 1,
                    timeoutError: timeoutError * 2
                });
            }, timeoutError);
        }
    }

    componentWillMount() {
        const { updateLoginRetriesDispatch } = this.props;

        updateLoginRetriesDispatch({
            tries: undefined,
            maxTries: undefined,
            timeout: undefined,
            timeoutError: undefined
        });
    }

    componentWillUnmount() {
        const { updateLoginRetriesDispatch } = this.props;

        this.timeout && clearTimeout(this.timeout);
        updateLoginRetriesDispatch({
            tries: undefined,
            maxTries: undefined,
            timeout: undefined,
            timeoutError: undefined
        });
    }

    componentWillReceiveProps() {
        const { loginTries: { timeout } } = this.props;

        this.timeout = setTimeout(this.login, timeout);
    }

    render() {
        const { loginTries: { tries, maxTries } } = this.props;

        return (
            <Loader
                Component={NotAvailable}
                condition={tries !== maxTries}
            >
                <div className={styles.loginContainer}>
                    <FormattedMessage
                        id='Login.starting'
                        defaultMessage='Starting...'
                    >
                        {(txt) => (
                            <span
                                className={styles.mainSpan}>
                                {txt}
                            </span>
                        )}
                    </FormattedMessage>
                </div>
            </Loader>
        );
    }
}

Login.propTypes = {
    history: PropTypes.shape({}).isRequired,
    loginTries: PropTypes.shape({
        tries: PropTypes.number,
        maxTries: PropTypes.number,
        timeout: PropTypes.number,
        timeoutError: PropTypes.number
    }).isRequired,
    updateLoginRetriesDispatch: PropTypes.func.isRequired,
    fetchCurrentUserDispatch: PropTypes.func.isRequired,
    setCurrentEmitterDispatch: PropTypes.func.isRequired,
    logErrorDispatch: PropTypes.func.isRequired,
    emitter: PropTypes.shape({})
};

function mapStoreToProps(store) {
    return {
        emitter: store.currentPeer.emitter,
        loginTries: store.loginTries
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loginDispatch: login,
        updateLoginRetriesDispatch: updateLoginRetries,
        fetchCurrentUserDispatch: fetchCurrentUser,
        setCurrentEmitterDispatch: setCurrentEmitter,
        logErrorDispatch: logError
    }, dispatch);
};

export default connect(mapStoreToProps, mapDispatchToProps)(Login);