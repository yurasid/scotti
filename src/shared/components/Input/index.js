import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '../';

import inputStyles from './index.scss';

class Input extends Component {
    constructor() {
        super();

        this.state = {
            toggleVisibility: false,
            activateField: false
        };
    }

    render() {
        const {
            placeholder,
            label,
            type,
            icon,
            input,
            input: {
                value,
                name
            },
            meta: {
                error,
                touched,
                active,
                valid
            }
        } = this.props;

        const {
            activateField,
            toggleVisibility
        } = this.state;

        const isPassField = type === 'password';

        return (
            <Fragment>
                <div className={inputStyles.fullContainer}>
                    <label
                        htmlFor={name}
                        className={classNames({
                            [inputStyles.labelNormal]: !icon,
                            [inputStyles.labelIconNormal]: !!icon,
                            [inputStyles.labelActive]: (active || (value && value.length)) && !icon,
                            [inputStyles.labelIconActive]: (active || (value && value.length)) && !!icon,
                            [inputStyles.labelError]: !active && touched && !!error,
                            [inputStyles.labelValid]: !active && touched && !!valid
                        })}
                    >
                        {label}
                    </label>
                    <div className={classNames({
                        [inputStyles.inputContainerNormal]: true,
                        [inputStyles.inputContainerActive]: !!active || !!activateField,
                        [inputStyles.inputContainerWithIcon]: !!icon,
                        [inputStyles.inputContainerError]: !active && touched && !!error,
                        [inputStyles.inputContainerValid]: !active && touched && !!valid
                    })}>
                        {icon && (
                            <Icon name={typeof icon === 'string' ? icon : name} />
                        )}
                        <input
                            id={name}
                            {...input}
                            type={isPassField ? (toggleVisibility ? 'text' : 'password') : type}
                            placeholder={placeholder}
                        />
                        {isPassField && (
                            <div 
                                className={inputStyles.toggleVisibility}
                                onMouseEnter={() => {
                                    this.setState({
                                        activateField: true
                                    });
                                }}
                                onMouseLeave={() => {
                                    this.setState({
                                        activateField: false
                                    });
                                }}
                            >
                                <input
                                    onChange={() => {
                                        this.setState({
                                            toggleVisibility: !toggleVisibility
                                        });
                                    }}
                                    type='checkbox'
                                    id={`${name}Toggle`}
                                />
                                <label htmlFor={`${name}Toggle`}>
                                    <Icon name={toggleVisibility ? 'showpass' : 'hidepass'} />
                                </label>
                            </div>
                        )}
                    </div>
                    {!active && touched && error && (
                        <div className={inputStyles.errorsContainer}>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </Fragment>
        );
    }
}


Input.propTypes = {
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        active: PropTypes.bool,
        valid: PropTypes.bool,
        error: PropTypes.string
    }),
    icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    placeholder: PropTypes.string,
    success: PropTypes.string,
    error: PropTypes.string,
    warning: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    inputValue: PropTypes.string,
    save: PropTypes.func,
    input: PropTypes.shape({
        value: PropTypes.string,
        name: PropTypes.string
    })
};

Input.defaultProps = {
    save: null,
    placeholder: '',
    meta: {},
    label: '',
    inputValue: '',
    type: 'text',
    input: {}
};

export default Input;
