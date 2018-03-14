import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.css';

const Spinner = ({ className }) => (
    <div
        className={classNames({
            [styles.spinner]: true,
            [className]: !!className
        })}
    >
        <div className={styles.rightSide}>
            <div
                className={classNames({
                    [styles.bar]: true,
                    [styles.rightBar]: true
                })}
            />
        </div>
        <div className={styles.leftSide}>
            <div
                className={classNames({
                    [styles.bar]: true,
                    [styles.leftBar]: true
                })}
            />
        </div>
    </div>
);

Spinner.propTypes = {
    className: PropTypes.string
};

export default Spinner;