import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import { fetchEvents, setSelectedEvent } from '../../../shared/redux/actions/calendar';

import MonthEvent from './components/monthEvent';
// import AgendaEvent from './components/agendaEvent';
import EventsPopupWrapper from './components/eventsPopupOverlay';
import Share from './components/shareView';
import ShareToolBar from './components/shareToolbar';

import './extended.css';

const moment = extendMoment(Moment);

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);

class Calendar extends Component {
    static propTypes = {
        peer: PropTypes.shape({}),
        events: PropTypes.array.isRequired,
        fetchEventsDispatch: PropTypes.func.isRequired,
        setSelectedEventDispatch: PropTypes.func.isRequired,
        withControls: PropTypes.bool
    }

    static defaultProps = {
        withControls: true
    }

    constructor() {
        super();

        this.state = {
            selectedCellsRanges: [],
            view: 'month'
        };
    }

    getToolbar = () => {
        const { view } = this.state;
        const { withControls } = this.props;

        if (view === 'share') {
            return (props) => {
                return (
                    <ShareToolBar
                        {...props}
                        onBackClick={() => {
                            this.setState({
                                view: 'month',
                                selectedCellsRanges: []
                            });
                        }}
                    />
                );
            };
        }

        if (!withControls) {
            return ({ label }) => (
                <div className='rbc-toolbar'>
                    <span className='rbc-toolbar-label'>
                        {label}
                    </span>
                </div>
            );
        }

        return false;
    }

    componentWillMount() {
        const { fetchEventsDispatch } = this.props;

        fetchEventsDispatch();
    }

    onEventSelectHandler = (event, e) => {
        const { setSelectedEventDispatch } = this.props;
        const target = e.currentTarget;
        const measure = target.getBoundingClientRect();

        setSelectedEventDispatch({ ...event, measure });
    }

    eventPropGetter = (event) => {
        const { bgColor } = event;

        return {
            style: {
                backgroundColor: bgColor
            }
        };
    }

    onSelectSlot = ({ start, end }) => {
        const { selectedCellsRanges } = this.state;
        const startArray = this.ctrl ? selectedCellsRanges : [];

        this.setState({
            selectedCellsRanges: startArray.concat(moment.range(start, moment(end).endOf('day')))
        }, () => {
            if (!this.ctrl) {
                this.setState({
                    view: 'share'
                });
            }
        });
    }

    isDayInRange = (date) => {
        const { selectedCellsRanges } = this.state;

        const inRanges = selectedCellsRanges.filter(range => {
            return range.contains(moment(date));
        });

        return !!inRanges.length;
    }

    customDayPropGetter = date => {
        return {
            className: classNames({
                'rbc-selected-cell': this.isDayInRange(date)
            })
        };
    };

    componentWillUnmount() {
        const { peer } = this.props;

        peer && peer.sendEvents();
    }

    render() {
        const { withControls, events } = this.props;
        const { view, selectedCellsRanges } = this.state;

        const components = {
            event: MonthEvent
        };

        const toolbar = this.getToolbar();

        toolbar && (components.toolbar = toolbar);

        const bigCalendarProps = {
            className: classNames({
                'dashboardStyle': !withControls
            }),
            popup: true,
            selectable: !!withControls,
            events: events,
            view,
            onView: () => {
                console.log('go'); // eslint-disable-line
            },
            components,
            defaultDate: new Date(),
            onSelectEvent: this.onEventSelectHandler,
            onSelectSlot: this.onSelectSlot,
            dayPropGetter: this.customDayPropGetter,
            onNavigate: () => { }
        };

        if (view === 'month') {
            bigCalendarProps.views = [view];
            bigCalendarProps.eventPropGetter = this.eventPropGetter;
        } else {
            const range = selectedCellsRanges[0];
            const start = range.start;

            bigCalendarProps.views = {
                share: Share
            };

            bigCalendarProps.length = range.end.diff(start, 'days');
            bigCalendarProps.date = new Date(start);
        }

        return (
            <Fragment>
                <EventsPopupWrapper />
                <BigCalendar
                    tabIndex='0'
                    onKeyDown={() => {
                        this.ctrl = true;
                    }}

                    onKeyUp={() => {
                        this.ctrl = false;
                    }}

                    {...bigCalendarProps}
                />
            </Fragment>
        );
    }
}

function mapStoreToProps(store) {
    return {
        peer: store.currentPeer.peer,
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
