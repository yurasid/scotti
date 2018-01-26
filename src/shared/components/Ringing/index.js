import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '../';

import styles from './index.scss';

class Ring extends Component {
    constructor() {
        super();

        this.state = {
            active: false,
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
            text,
            interval
        } = this.props;

        const {
            active,
            height,
            width,
        } = this.state;

        const iconProps = {};
        const containerStyle = {};
        const minMeasure = height < width ? height : width;

        const containerProps = {
            ref: container => this.container = container,
            className: classNames({
                [styles.circle]: true,
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
                iconProps.height = minMeasure * 0.80;

                if (color) {
                    iconProps.color = color;
                }
            }
        }

        return (
            <div { ...containerProps }>
                <span className={styles.innerCircle} ref={component => this.innerCircle = component}/>
                {icon && !active && <Icon name={icon} {...iconProps} />}
                {icon && !!active && <Icon name={iconActive || icon} {...iconProps} />}
                {text && <span className={styles.textSpan}>{text}</span>}
            </div>
        );
    }
}


Ring.propTypes = {
    icon: PropTypes.string,
    iconActive: PropTypes.string,
    color: PropTypes.string,
    text: PropTypes.string,
    interval: PropTypes.number
};

Ring.defaultProps = {
    icon: 'logodef'
};

export default Ring;
