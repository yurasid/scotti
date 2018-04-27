import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EventPopup from './eventPopup';

class PopupsWrapper extends Component {
    static propTypes = {
        event: PropTypes.shape({})
    }

    constructor() {
        super();

        this.state = {
            top: 0,
            left: 0,
            width: 0,
            height: 0
        };
    }

    componentDidMount() {
        const { top, left, width, height } = this.overlay.getBoundingClientRect();

        this.setState({ top, left, width, height });
    }

    render() {
        const { event } = this.props;
        const { top, left, width, height } = this.state;

        return (
            <div
                ref={ref => this.overlay = ref}
                className='popupOverlay'
            >
                {event && (
                    <EventPopup
                        overlay={{ top, left, width, height }}
                        event={event}
                    />
                )}
            </div>
        );
    }
}

function mapStoreToProps(store) {
    return {
        event: store.calendar.event
    };
}

export default connect(mapStoreToProps, null)(PopupsWrapper);