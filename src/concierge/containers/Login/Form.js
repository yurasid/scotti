import React from 'react';
import { compose } from 'redux';
import { Field, reduxForm, propTypes } from 'redux-form';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

import { required as requiredCreator, maxLength, minLength } from '../../../shared/utils/validation';

import { Input } from '../../../shared/components';

import styles from './index.scss';

const required = requiredCreator();

const maxLength15 = maxLength(15);
const minLength4 = minLength(4);

const renderField = (props) => (
    <Input {...props} />
);

const messages = defineMessages({
    username: {
        id: 'Login.usernameLabel',
        defaultMessage: 'Username'
    },
    password: {
        id: 'Login.passwordLabel',
        defaultMessage: 'Password'
    }
});

const LoginForm = ({
    handleSubmit,
    submitting,
    error,
    clearSubmitErrors,
    intl: { formatMessage }
}) => (
    <div className={styles.loginFormContainer}>
        <h1>
            <FormattedMessage
                id='Login.headerText'
                defaultMessage='Login'
            />
        </h1>
        <form className={styles.loginForm} onSubmit={handleSubmit} onFocus={() => {
            return error && clearSubmitErrors();
        }}>
            {error && <span className={styles.formError}>
                {error.id ? (
                    <FormattedMessage {...error} />
                ) : error}
            </span>}
            <Field name='username' type='text'
                component={renderField} label={formatMessage(messages.username)}
                validate={[required, maxLength15, minLength4]}
                className={styles.formRow} icon={true}
            />
            <Field name='password' type='password'
                component={renderField} label={formatMessage(messages.password)}
                validate={[required]} icon={true} autocomplete='current-password'
            />
            <button
                type='submit'
                disabled={submitting}
                className={styles.submitButton}
            >
                <FormattedMessage
                    id='Login.btnGetStarted'
                    defaultMessage='Get Started'
                />
            </button>
        </form>
    </div>
);

LoginForm.propTypes = { ...propTypes };

export default compose (
    reduxForm({
        form: 'loginForm'
    }),
    injectIntl,
)(LoginForm);
