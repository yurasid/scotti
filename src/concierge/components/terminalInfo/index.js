import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';

import styles from './index.m.scss';

const messages = defineMessages({
    standBy: {
        id: 'TerminalInfo.standBy',
        defaultMessage: 'Standby'
    },
    notActive: {
        id: 'TerminalInfo.notActive',
        defaultMessage: 'Not Active'
    }
});

const TerminalInfo = ({
    intl: { formatMessage },
    terminal: {
        mall: { title: mallName },
        location,
        name,
        is_enabled,
    },
    withStatus,
    className }) => {

    let status;

    switch (is_enabled) {
        case true:
            status = formatMessage(messages.standBy);
            break;

        default:
            status = formatMessage(messages.notActive);
            break;
    }

    return (
        <div className={classNames({
            [styles.terminalInfo]: true,
            [className]: !!className
        })}>
            {name && (
                <Fragment>
                    <span>{name}</span>
                    <FormattedMessage
                        id='TerminalInfo.mall'
                        defaultMessage='Mall:'
                    >
                        {(txt) => (
                            <div className={styles.infoLine}>
                                <span>
                                    {txt}
                                </span>
                                <span>
                                    {mallName}
                                </span>
                            </div>
                        )}
                    </FormattedMessage>
                    <FormattedMessage
                        id='TerminalInfo.location'
                        defaultMessage='Location:'
                    >
                        {(txt) => (
                            <div className={styles.infoLine}>
                                <span>
                                    {txt}
                                </span>
                                <span>
                                    {location}
                                </span>
                            </div>
                        )}
                    </FormattedMessage>
                    {withStatus && <FormattedMessage
                        id='TerminalInfo.status'
                        defaultMessage='Status:'
                    >
                        {(txt) => (
                            <div className={styles.infoLine}>
                                <span>
                                    {txt}
                                </span>
                                <span className={(is_enabled && styles.standBy) || styles.notActive}>
                                    {status}
                                </span>
                            </div>
                        )}
                    </FormattedMessage>}
                </Fragment>
            )}
        </div>
    );
};

TerminalInfo.propTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired,
    className: PropTypes.string,
    withStatus: PropTypes.bool,
    terminal: PropTypes.shape({
        location: PropTypes.string,
        name: PropTypes.string,
        is_enabled: PropTypes.bool,
        mall: PropTypes.shape({
            title: PropTypes.string
        }).isRequired
    }).isRequired
};

TerminalInfo.defaultProps = {
    terminal: {
        location: '',
        name: '',
        mall: {
            title: ''
        },
        is_enabled: false
    }
};

export default injectIntl(TerminalInfo);