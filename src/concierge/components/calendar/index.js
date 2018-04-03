import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchEvents, setSelectedEvent } from '../../../shared/redux/actions/calendar';

import Event from './components/event';
import EventWrapper from './components/eventWrapper';
import EventsPopupWrapper from './components/eventsPopupOverlay';

require('./index.global.css');
require('./extended.global.css');

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);

class Calendar extends Component {
    componentWillMount() {
        const { fetchEventsDispatch } = this.props;

        fetchEventsDispatch();
    }

    render() {
        const { events, setSelectedEventDispatch } = this.props;

        const components = {
            event: Event,
            eventWrapper: EventWrapper
        };

        return (
            <Fragment>
                <EventsPopupWrapper />
                <BigCalendar
                    popup
                    events={events}
                    // views={['month']}
                    components={components}
                    defaultDate={new Date()}
                    onSelectEvent={(event, e) => {
                        const target = e.currentTarget;
                        const measure = target.getBoundingClientRect();

                        setSelectedEventDispatch({ ...event, measure });
                    }}
                />
            </Fragment>
        );
    }
}

Calendar.propTypes = {
    events: PropTypes.array.isRequired,
    fetchEventsDispatch: PropTypes.func.isRequired,
    setSelectedEventDispatch: PropTypes.func.isRequired
};

function mapStoreToProps(store) {
    return {
        events: store.calendar.events
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchEventsDispatch: fetchEvents,
        setSelectedEventDispatch: setSelectedEvent
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(Calendar);
