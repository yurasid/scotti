import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { Icon } from '../../../../shared/components/';

import styles from './../index.scss';

const LoaderComponent = () => (
    <Fragment>
        <Icon name='logoconnecting' className={styles.connectingIco} />
        <FormattedMessage
            id='Video.connecting'
            defaultMessage='connecting...'
        >
            {(txt) => (
                <span className={styles.mainSpan}>
                    {txt}
                </span>
            )}
        </FormattedMessage>
        <FormattedMessage
            id='Video.wait'
            defaultMessage='please wait for a moment'
        >
            {(txt) => (
                <span className={styles.subSpan}>
                    {txt}
                </span>
            )}
        </FormattedMessage>
    </Fragment>
);

export default LoaderComponent;