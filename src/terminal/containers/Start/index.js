import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Ringing } from '../../../shared/components';

import styles from './index.scss';

const Start = ({ history }) => (
    <div
        className={styles.container}
        onClick={() => {
            history.push('/call');
        }}
    >
        <Ringing
            icon='bell'
            iconActive='bellpressed'
            color='#ffffff'
            interval={10000}
            withCircle={true}
        />

        <FormattedMessage
            id='Main.call.touchToConnect'
            defaultMessage='touch to connect'
        >
            {(txt) => (
                <span className={styles.touchSpan}>
                    {txt}
                </span>
            )}
        </FormattedMessage>

        <FormattedMessage
            id='Main.call.inquiries'
            defaultMessage='we are waiting for your inquiries'
        >
            {(txt) => (
                <span className={styles.startSpan}>
                    {txt}
                </span>
            )}
        </FormattedMessage>
    </div>
);

Start.propTypes = {
    history: PropTypes.shape({}).isRequired
};

export default Start;