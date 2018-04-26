import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { union, without } from 'lodash';

import { setShareEvents } from '../../../../shared/redux/actions/calendar';

class Agenda extends React.Component {
    static propTypes = {
        events: PropTypes.array,
        date: PropTypes.instanceOf(Date),
        length: PropTypes.number.isRequired,
        eventPropGetter: PropTypes.func,
        selected: PropTypes.object,
        culture: PropTypes.string,
        components: PropTypes.object.isRequired,
        messages: PropTypes.shape({
            date: PropTypes.string,
            time: PropTypes.string,
        }),
        setShareEventsDispatch: PropTypes.func.isRequired,
        shareEvents: PropTypes.array
    }

    constructor() {
        super();

        this.refsObject = {};
    }

    componentWillUnmount() {
        const { setShareEventsDispatch } = this.props;

        setShareEventsDispatch([]);
    }

    render() {
        let { length, date, events, messages } = this.props;
        let end = moment(date).add(length, 'd');

        let range = Array.from(moment.range(date, end).by('days'), date => new Date(date));

        events = events.filter(({ start: eventStart, end: eventEnd }) => {
            const momentEStart = moment(eventStart);
            const momentEEnd = moment(eventEnd);
            const momentRStart = moment(date);
            const momentREnd = moment(end);

            const rangeInside = momentEStart.startOf('day').isSameOrBefore(momentRStart) &&
                momentEEnd.endOf('day').isSameOrAfter(momentREnd);

            const startInside = momentEStart.isSameOrAfter(momentRStart) && momentEStart.isSameOrBefore(momentREnd);
            const endInside = momentEEnd.isSameOrAfter(momentRStart) && momentEEnd.isSameOrBefore(momentREnd);

            return rangeInside || startInside || endInside;
        });

        events.sort((a, b) => a.start - +b.start);

        const colgroups = (
            <colgroup>
                <col style={{ width: '5%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '65%' }} />
            </colgroup>
        );

        return (
            <div className='rbc-agenda-view'>
                <table ref={ref => this.refsObject.header = ref} className='rbc-agenda-table'>
                    {colgroups}
                    <thead>
                        <tr>
                            <th className='rbc-header' />
                            <th className='rbc-header' ref={ref => this.refsObject.dateCol = ref}>
                                {messages.date}
                            </th>
                            <th className='rbc-header' ref={ref => this.refsObject.timeCol = ref}>
                                {messages.time}
                            </th>
                            <th className='rbc-header'>{messages.event}</th>
                        </tr>
                    </thead>
                </table>
                <div className='rbc-agenda-content' ref={ref => this.refsObject.content = ref}>
                    <table className='rbc-agenda-table'>
                        {colgroups}
                        <tbody ref={ref => this.refsObject.tbody = ref}>
                            {
                                range.map((day, idx) => {
                                    return this.renderDay(day, events, idx);
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    renderDay = (day, events, dayKey) => {
        let {
            components,
            eventPropGetter,
            shareEvents,
            setShareEventsDispatch
        } = this.props;

        let EventComponent = components.event;
        let DateComponent = components.date;

        events = events.filter(({ start: eventStart, end: eventEnd }) => {
            return moment(eventStart).startOf('day').isSameOrBefore(moment(day)) &&
                moment(eventEnd).endOf('day').isSameOrAfter(moment(day));
        });

        return events.map((event, idx) => {
            const { start, end } = event;
            const { className, style } = eventPropGetter
                ? eventPropGetter(
                    event,
                    start,
                    end,
                    false
                )
                : {};

            let first = false;

            if (idx === 0) {
                const dateLabel = moment(day).format('ddd, DD MMM');

                first = (
                    <td rowSpan={events.length} className='rbc-agenda-date-cell'>
                        {DateComponent ? (
                            <DateComponent day={day} label={dateLabel} />
                        ) : (dateLabel)}
                    </td>
                );
            }

            let title = event.title;
            let eventChecked = false;
            let eventCheckedCurrentDay = false;

            shareEvents.map(({ id: eventId, day: eventDay }) => {
                if (!eventChecked && eventId === event.id) {
                    eventChecked = true;
                }

                if (eventDay === day.toString() && eventId === event.id) {
                    eventCheckedCurrentDay = true;
                }
            });

            return (
                <tr key={dayKey + '_' + idx} className={className} style={style}>
                    <td>
                        <input
                            onClick={(e) => {
                                const { currentTarget } = e;
                                const { checked } = currentTarget;
                                const day = currentTarget.value;
                                let newShareEvents = shareEvents;
                                const shareEvent = Object.assign(event, { day });

                                if (checked) {
                                    newShareEvents = union(shareEvents, [shareEvent]);
                                } else {
                                    newShareEvents = without(shareEvents, shareEvent);
                                }

                                setShareEventsDispatch(newShareEvents);
                            }}
                            type='checkbox'
                            checked={eventCheckedCurrentDay}
                            value={day}
                            disabled={!eventCheckedCurrentDay && eventChecked}
                        />
                    </td>
                    {first}
                    <td className='rbc-agenda-time-cell'>
                        {this.timeRangeLabel(day, event)}
                    </td>
                    <td className='rbc-agenda-event-cell'>
                        {EventComponent ? (
                            <EventComponent event={event} title={title} />
                        ) : (title)}
                    </td>
                </tr>
            );
        }, []);
    }

    timeRangeLabel = (day, event) => {
        let {
            messages,
            components,
        } = this.props;

        let labelClass = '',
            TimeComponent = components.time,
            label = messages.allDay;

        const { start, end, allDay } = event;

        const timeRangeFormat = ({ start, end }) => {
            return `${moment(start).format('HH:mm')} — ${moment(end).format('HH:mm')}`;
        };

        if (!allDay) {
            if (moment(start).isSame(moment(end), 'day')) {
                label = timeRangeFormat({ start, end });
            } else if (moment(day).isSame(moment(start), 'day')) {
                label = moment(start).format('HH:mm');
            } else if (moment(day).isSame(moment(end), 'day')) {
                label = moment(end).format('HH:mm');
            }
        }

        if (moment(day).isAfter(moment(start), 'day')) {
            labelClass = 'rbc-continues-prior';
        }

        if (moment(day).isBefore(moment(end), 'day')) {
            labelClass += ' rbc-continues-after';
        }

        return (
            <span className={labelClass.trim()}>
                {TimeComponent ? (
                    <TimeComponent event={event} day={day} label={label} />
                ) : (label)}
            </span>
        );
    }
}

Agenda.range = (start, { length = Agenda.defaultProps.length }) => {
    let end = moment(start).add(length, 'days');
    return { start, end };
};

Agenda.title = (
    start,
    { length = Agenda.defaultProps.length }
) => {
    let end = moment(start).add(length, 'days');
    return `${moment(start).format('DD MMM YYYY')} — ${moment(end).format('DD MMM YYYY')}`;
};

function mapStateToProps(store) {
    return {
        shareEvents: store.calendar.shareEvents
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setShareEventsDispatch: setShareEvents
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Agenda);