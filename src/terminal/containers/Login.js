import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import login from '../redux/actions/login';

class Login extends Component {
    login = async () => {
        const { loginDispatch, history } = this.props;

        try {
            await loginDispatch({
                'unique_code': '1thsHX9ACe0KhbFqFmZT3OrFHwBWHnQy',
                'password': 'secret'
            });
    
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
    history: PropTypes.shape({}).isRequired
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loginDispatch: login
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(Login);