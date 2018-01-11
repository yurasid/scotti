import React from 'react';
import PropTypes from 'prop-types';

const MenuItem = ({
    text
}) => (
    <div className='menuItem'>
        <span>{text}</span>
    </div>
);

MenuItem.propTypes = {
    text: PropTypes.string
};

MenuItem.defaultProps = {
    text: 'Unknown item'
};

export default MenuItem;