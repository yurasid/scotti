import React from 'react';
import { Field, reduxForm, propTypes } from 'redux-form';
import { Input } from '../../../shared/components';
import { required, maxLength, minLength } from '../../../shared/validation';

import loginStyles from './index.scss';

const maxLength15 = maxLength(15);
const minLength4 = minLength(4);

const renderField = (props) => (
    <Input {...props} />
);

const LoginForm = ({ handleSubmit, submitting }) => (
    <div className={loginStyles.loginFormContainer}>
        <h1>Login</h1>
        <form className={loginStyles.loginForm} onSubmit={handleSubmit}>
            <Field name='username' type='text'
                component={renderField} label='Username'
                validate={[required, maxLength15, minLength4]}
                className={loginStyles.formRow} icon={true}
            />
            <Field name='password' type='password'
                component={renderField} label='Password'
                validate={[required]} icon={true}
            />
            <button type='submit' disabled={submitting} className={loginStyles.submitButton}>Get Started</button>
        </form>
    </div>
);

LoginForm.propTypes = { ...propTypes };

export default reduxForm({
    form: 'loginForm'
})(LoginForm);