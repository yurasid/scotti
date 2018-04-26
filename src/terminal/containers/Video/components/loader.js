import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { LogoSpinner } from '../../../../shared/components/';

import styles from './../index.m.scss';

const LoaderComponent = () => (
    <Fragment>
        <LogoSpinner className={styles.connectingIco} />
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