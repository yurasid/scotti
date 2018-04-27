import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class Event extends Component {
    static propTypes = {
        event: PropTypes.shape({
            title: PropTypes.string,
            desc: PropTypes.string
        }).isRequired
    }

    render() {
        const { event } = this.props;
        const { title, desc } = event;

        return (
            <Fragment>
                <span>{title}</span>
                <p
                    dangerouslySetInnerHTML={{ __html: desc }}
                />
            </Fragment>
        );
    }
}

export default Event;