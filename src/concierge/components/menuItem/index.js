import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

const MenuItem = ({
    text,
    active,
    onClick
}) => (
    <div
        className={classNames({
            [styles.menuItem]: true,
            [styles.active]: active
        })}
        onClick={onClick}
    >
        <span>{text}</span>
    </div>
);

MenuItem.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string,
    active: PropTypes.bool
};

MenuItem.defaultProps = {
    text: 'Unknown item',
    active: false,
    onClick: () => { }
};

export default MenuItem;