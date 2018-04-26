import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { MdAccessTime, MdLocationOn } from 'react-icons/lib/md';

import styles from './event.m.scss';

class Event extends Component {
    static propTypes = {
        event: PropTypes.shape({}),
        onPlus: PropTypes.func.isRequired,
        index: PropTypes.number,
        minimized: PropTypes.any
    }

    constructor() {
        super();

        this.state = {
            collapsed: true,
            minimized: false
        };
    }

    onClick = () => {
        const { onPlus, index } = this.props;
        const { collapsed } = this.state;
        this.setState({
            collapsed: !collapsed
        }, () => {
            onPlus(collapsed ? index % 2 : undefined);
        });
    };

    componentWillReceiveProps(nextProps) {
        const { collapsed } = this.state;
        const { minimized, index } = nextProps;
        const minimize = typeof minimized !== 'undefined' && minimized !== index % 2;

        this.setState({
            collapsed: minimize || collapsed,
            minimized: minimize
        });
    }

    render() {
        const { event } = this.props;
        const { collapsed, minimized } = this.state;
        const {
            attachments,
            day,
            title,
            start,
            end,
            location,
            allDay,
            desc
        } = event;

        const file = attachments && attachments[0];
        const momentDay = moment(new Date(day));
        const momentStart = moment(start);
        const momentEnd = moment(end);

        let timePeriod = `${momentStart.format('DD MMM')}-${momentEnd.format('DD MMM')}`;

        const sameDates = momentStart.isSame(momentEnd, 'day');

        if (sameDates) {
            timePeriod = allDay ? `${momentStart.format('DD MMM')}` : `${momentStart.format('HH:mm')}-${momentEnd.format('HH:mm')}`;
        }

        return (
            <Fragment>
                <div
                    className={classNames({
                        [styles.top]: true,
                        [styles.hide]: minimized
                    })}
                    style={{
                        backgroundImage: `url("https://drive.google.com/uc?export=view&id=${file.fileId}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />

                <div className={classNames({
                    [styles.bottom]: true,
                    [styles.collapsed]: collapsed
                })}>
                    <div
                        className={classNames({
                            [styles.topData]: true,
                            [styles.minimized]: minimized
                        })}
                    >
                        <span className={styles.date}>
                            <span>{momentDay.format('D')}</span>
                            <span>{momentDay.format('MMMM')}</span>
                        </span>
                        <span className={styles.title}>{title}</span>
                    </div>
                    <div className={styles.shortInfo}>
                        <div
                            className={classNames({
                                [styles.hide]: minimized
                            })}
                        >
                            <span className={styles.time}>
                                <MdAccessTime />
                                {timePeriod}
                            </span>
                            {location && <span className={styles.location}>
                                <MdLocationOn />
                                {location}
                            </span>}
                        </div>
                        <span
                            className={classNames({
                                [styles.plus]: true,
                                [styles.minus]: !collapsed
                            })}
                            onClick={this.onClick}
                        />
                    </div>
                    <div
                        className={classNames({
                            [styles.description]: true,
                            [styles.hide]: collapsed
                        })}
                        dangerouslySetInnerHTML={{ __html: desc }}
                    />
                </div>
            </Fragment>
        );
    }
}

export default Event;