import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import classNames from 'classnames';

import Event from './event';

import './index.scss';

class Events extends Component {
    static propTypes = {
        events: PropTypes.array
    }

    constructor() {
        super();

        this.state = {};
    }

    collapse = (topOrBottom) => {
        const isParam = typeof topOrBottom !== 'undefined';
        let collapsed;

        if (isParam) {
            collapsed = topOrBottom;
        }

        this.setState({
            collapsed: collapsed
        });
    }

    render() {
        const { events } = this.props;
        const { collapsed } = this.state;
        const renderEvents = events || [];
        const isCollapsed = typeof collapsed !== 'undefined';

        return (
            <Slider
                dots={false}
                cssEase='linear'
                rows={2}
                slidesPerRow={1}
                infinite={false}
                speed={500}
                adaptiveHeight
                arrows
                className={classNames({
                    'hide': !renderEvents.length,
                    'topOpened': isCollapsed && !collapsed,
                    'bottomOpened': isCollapsed && !!collapsed
                })}
            >
                {
                    renderEvents.map((event, index) => {
                        const { id } = event;
                        return (
                            <Event
                                key={id}
                                index={index}
                                event={event}
                                onPlus={this.collapse}
                                minimized={collapsed}
                            />
                        );
                    })
                }
            </Slider >
        );
    }
}

export default Events;