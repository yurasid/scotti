import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

import login from '../../redux/actions/login';

import LoginForm from './Form';
import loginStyles from './index.scss';

import { Icon } from '../../../shared/components/';
import CopyRight from '../../components/copyRight/';

function onEnterPress(e, dispatch) {
    const keyCode = e.keyCode || e.which;

    if (keyCode !== 13) {
        return false;
    }

    e.stopPropagation();
    
    return dispatch(submit('loginForm'));
}

class Login extends Component {
    handlerSubmit(values) {
        const { dispatch, history } = this.props;
        const loginPromise = dispatch(login({
            username: values.username,
            password: values.password
        }));
    
        loginPromise
            .then(() => {
                history.push('/');
            })
            .catch(() => {
                throw { username: 'Wrong credentials' };
            });
    
        return loginPromise;
    };

    componentWillMount() {
        this.handlerSubmit = ::this.handlerSubmit;
    }

    render() {
        const { dispatch } = this.props;

        return (
            <div
                className={loginStyles.loginContainer}
                onKeyPress={e => onEnterPress(e, dispatch)}
            >
                <div className={loginStyles.topSection}>
                    <Icon name='logodef' />
                    <span>realtime concierge service</span>
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
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.shape({}).isRequired
};

export default connect()(Login);
