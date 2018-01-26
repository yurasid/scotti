import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Icon } from '../../../shared/components';
import styles from './index.scss';

const Main = ({ children }) => {
    const vmin = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
    const iconScottiProps = { color: '#8b8b8b', height: vmin * 0.03 };
    const iconLogoProps = { color: '#009bf5', height: vmin * 0.17 };

    return (
        <Fragment>
            <header>
                <div className={styles.headerBlock}>
                    <div className={styles.headerLeftBlock}>
                        <span className={styles.headerFirstSpan}>scotti</span>
                        <span className={styles.headerSecondSpan}>
                            <FormattedMessage
                                id='Main.logoMessage'
                                defaultMessage='realtime concierge'
                            />
                        </span>
                    </div>
                    <Icon name='logodef' {...iconLogoProps} />
                </div>
            </header>
            <main>
                { children }
            </main>
            <footer>
                <Icon name='scottilogo' {...iconScottiProps} />
                <span className={styles.footerSpan}>
                    <FormattedMessage
                        id='Main.logoMessageFull'
                        defaultMessage='realtime concierge service'
                    />
                </span>
            </footer>
        </Fragment>
    );
};

Main.propTypes = {
    children: PropTypes.element
};

export default Main;
