import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

import { Ringing } from '../../../shared/components';

import styles from './index.scss';

const messages = defineMessages({
    text: {
        id: 'Main.call.touchToConnect',
        defaultMessage: 'touch to connect'
    }
});

const Start = ({ intl: { formatMessage } }) => (
    <div className={styles.container}>
        <Ringing
            icon='bell'
            iconActive='bellpressed'
            color='#ffffff'
            text={formatMessage(messages.text)}
            interval={10000}
        />
        <span className={styles.startSpan}>
            <FormattedMessage
                id='Main.call.inquiries'
                defaultMessage='we are waiting for your inquiries'
            />
        </span>
    </div>
);

Start.propTypes = {
    history: PropTypes.shape({}).isRequired,
    intl: PropTypes.shape({}).isRequired,
};

export default injectIntl(Start);