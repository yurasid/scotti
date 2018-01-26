import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { submit, SubmissionError } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { login } from '../../redux/actions/auth';

import LoginForm from './Form';
import { Icon } from '../../../shared/components/';
import CopyRight from '../../components/copyRight/';

import loginStyles from './index.scss';

class Login extends Component {
    onEnterPress = (e) => {
        const { submitDispatch } = this.props;
        const keyCode = e.keyCode || e.which;

        if (keyCode !== 13) {
            return false;
        }

        e.stopPropagation();

        return submitDispatch('loginForm');
    }

    handlerSubmit = (values) => {
        return new Promise(async (resolve, reject) => {
            const { loginDispatch, history } = this.props;

            try {
                await loginDispatch({
                    username: values.username,
                    password: values.password
                });

                resolve(history.push('/'));
            } catch (error) {
                reject(new SubmissionError({
                    username: true,
                    password: true,
                    _error: error && error.message || 'Something went wrong'
                }));
            }
        });
    }

    render() {
        return (
            <div
                className={loginStyles.loginContainer}
                onKeyPress={this.onEnterPress}
            >
                <div className={loginStyles.topSection}>
                    <Icon name='logodef' />
                    <span>
                        <FormattedMessage
                            id='Login.logoMessage'
                            defaultMessage='realtime concierge service'
                        />
                    </span>
                </div>
                <LoginForm onSubmit={this.handlerSubmit} />
                <div className={loginStyles.bottomSection}>
                    <CopyRight />
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    history: PropTypes.shape({}).isRequired,
    submitDispatch: PropTypes.func.isRequired,
    loginDispatch: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loginDispatch: login,
        submitDispatch: submit
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(Login);
