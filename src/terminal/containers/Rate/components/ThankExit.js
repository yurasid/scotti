import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { Icon } from '../../../../shared/components';

import styles from '../index.m.scss';

const ThankYou = () => {
    const vmin = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
        
    return (
        <Fragment>
            <FormattedMessage
                id='Main.afterCall.thankYouService'
                defaultMessage='Thank You for using our service!'
            >
                {(txt) => (
                    <span className={styles.mainSpan}>{txt}</span>
                )}
            </FormattedMessage>
            <FormattedMessage
                id='Main.afterCall.thankYouService.glad'
                defaultMessage='we are always glad to help you'
            >
                {(txt) => (
                    <span className={styles.subSpan}>{txt}</span>
                )}
            </FormattedMessage>
            <Icon name='bell' color='#75df00' height={vmin * 0.1} />
        </Fragment>
    );
};

export default ThankYou;