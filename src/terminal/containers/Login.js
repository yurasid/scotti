import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import login from '../redux/actions/login';
import { fetchCurrentUser } from '../redux/actions/user';

class Login extends Component {
    login = async () => {
        const { loginDispatch, fetchCurrentUserDispatch, history } = this.props;

        try {
            await loginDispatch({
                'uid': '7c0b0522-3916-3b03-ac19-ad5805652145',
                'password': 'secret'
            });
            await fetchCurrentUserDispatch();

            return history.push('/');
        } catch (error) {
            return history.push('/error');
        }
    }

    componentWillMount() {
        this.login();
    }

    render() {
        return (
            <div>Login...</div>
        );
    }
}

Login.propTypes = {
    history: PropTypes.shape({}).isRequired,
    fetchCurrentUserDispatch: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loginDispatch: login,
        fetchCurrentUserDispatch: fetchCurrentUser
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(Login);