import React, { Fragment, Component } from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Button } from '../../../../shared/components';

import styles from '../index.m.scss';

const messages = defineMessages({
    yesButton: {
        id: 'Main.yesButton',
        defaultMessage: 'Yes'
    },
    noButton: {
        id: 'Main.noButton',
        defaultMessage: 'No'
    }
});

class Question extends Component {
    constructor() {
        super();

        this.state = {
            yesButton: {
                active: false,
                disabled: false
            },
            noButton: {
                active: false,
                disabled: false
            }
        };

        this.timeoutTime = 700;
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
    }

    genButtonProps = (options) => {
        const {
            color,
            icon,
            text,
            onClickHandler,
            state: { active, disabled },
            value
        } = options;
        return {
            color1: active ? '#ffffff' : color,
            icon: active ? icon : '',
            color2: color,
            className: classNames({
                [styles.button]: true,
                [styles.buttonInContainer]: true
            }),
            text: active ? '' : text,
            allInside: true,
            iconScale: 3,
            disabled: !!disabled,
            onClick: () => {
                this.setState({
                    yesButton: {
                        active: !!value,
                        disabled: !value
                    },
                    noButton: {
                        active: !value,
                        disabled: !!value
                    }
                }, () => {
                    this.timeout = setTimeout(() => onClickHandler(value), this.timeoutTime);
                });
            }
        };
    }

    render() {
        const { intl: { formatMessage }, onClick } = this.props;
        const {
            yesButton,
            noButton
        } = this.state;

        const yesButtonProps = this.genButtonProps({
            color: '#37AA69',
            icon: 'yesbtnactive',
            state: yesButton,
            text: formatMessage(messages.yesButton),
            value: true,
            onClickHandler: onClick
        });

        const noButtonProps = this.genButtonProps({
            color: '#e16950',
            icon: 'yesbtnactive',
            state: noButton,
            text: formatMessage(messages.noButton),
            onClickHandler: onClick
        });

        return (
            <Fragment>
                <FormattedMessage
                    id='Main.afterCall.satisgied'
                    defaultMessage='Are You satisfied with our service?'
                >
                    {(txt) => (
                        <span className={styles.mainSpan}>{txt}</span>
                    )}
                </FormattedMessage>
                <div className={styles.buttonsContainer}>
                    <Button {...yesButtonProps} />
                    <Button {...noButtonProps} />
                </div>
            </Fragment>
        );
    }
}

Question.propTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
};

export default injectIntl(Question);