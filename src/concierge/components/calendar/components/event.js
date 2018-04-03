import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Event extends Component {
    render() {
        const { event } = this.props;
        const { title, startTime } = event;

        return (
            <Fragment>
                {startTime && (
                    <span className='startTime'>
                        {moment(startTime).format('HH:mm')}
                    </span>
                )}
                <span>{title}</span>
            </Fragment>
        );
    }
}

Event.propTypes = {
    event: PropTypes.shape({
        title: PropTypes.string
    }).isRequired
};

export default Event;