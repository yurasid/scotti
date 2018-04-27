import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '../';

import styles from './index.m.css';

class Ring extends Component {
    constructor(props) {
        super();

        const { active } = props;

        this.state = {
            active: active,
            height: 0,
            width: 0
        };
    }

    toggleActive = (state) => {
        this.setState({
            active: (typeof state !== 'undefined' && state) || !this.state.active
        });
    }

    componentDidMount() {
        const { interval } = this.props;
        const { width, height } = this.container.getBoundingClientRect();

        this.innerCircle.addEventListener('animationend', () => this.toggleActive(false));

        if (interval) {
            this.interval = setInterval(() => {
                this.toggleActive(true);
            }, interval);
        }

        this.setState({
            width,
            height
        });
    }

    componentWillUnmount() {
        this.innerCircle.removeEventListener('animationend', () => this.toggleActive(false));
        this.interval && clearInterval(this.interval);
    }

    render() {
        const {
            color,
            icon,
            iconActive,
            interval,
            withCircle
        } = this.props;

        const {
            active,
            height,
            width,
        } = this.state;

        const iconProps = {};
        const containerStyle = { color };
        const minMeasure = height < width ? height : width;

        const containerProps = {
            ref: container => this.container = container,
            className: classNames({
                [styles.container]: true,
                [styles.circle]: withCircle,
                [styles.active]: !!active,
                [styles.interval]: !!interval,
            }),
            style: containerStyle
        };

        if (!interval) {
            containerProps.onClick = this.toggleActive;
        }

        if (minMeasure) {
            containerStyle.height = containerStyle.width = `${minMeasure}px`;

            if (icon) {
                iconProps.height = minMeasure * 0.8;
                iconProps.color = color;
            }
        }

        return (
            <div { ...containerProps }>
                <span className={styles.innerCircle} ref={component => this.innerCircle = component} />
                <span className={styles.middleCircle} />
                <span className={styles.outerCircle} />
                {icon && !active && <Icon name={icon} {...iconProps} />}
                {icon && !!active && <Icon name={iconActive || icon} {...iconProps} />}
            </div>
        );
    }
}


Ring.propTypes = {
    icon: PropTypes.string,
    iconActive: PropTypes.string,
    color: PropTypes.string,
    interval: PropTypes.number,
    active: PropTypes.bool,
    withCircle: PropTypes.bool
};

Ring.defaultProps = {
    icon: 'logorings',
    active: false,
    color: '#ffffff'
};

export default Ring;
