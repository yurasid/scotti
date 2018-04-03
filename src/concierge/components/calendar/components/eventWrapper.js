import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EventWrapper extends Component {
    render() {
        const { children, event: { bgColor } } = this.props;

        return (
            <div className='rbc-event-wrapper' style={{ color: bgColor }}>{children}</div>
        );
    }
}

EventWrapper.propTypes = {
    children: PropTypes.element,
    event: PropTypes.shape({
        bgColor: PropTypes.string
    }).isRequired
};

export default EventWrapper;