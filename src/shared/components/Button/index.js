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
        const { width, height } = this.container.getBoundingClientRect();

        this.setState({
            width,
            height
        });
    }

    render() {
        const {
            color1,
            color2,
            icon,
            text
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
                [styles.active]: !!active
            }),
            style: containerStyle
        };
        
        containerProps.onClick = this.toggleActive;
            
        if (minMeasure) {
            containerStyle.height = containerStyle.width = `${minMeasure}px`;
            containerStyle.color = color1;

            if (icon) {
                iconProps.height = minMeasure * 0.80;
                iconProps.color = color2;
            }
        }

        return (
            <div { ...containerProps }>
                {icon && !active && <Icon name={icon} {...iconProps} />}
                {text && <span className={styles.textSpan}>{text}</span>}
            </div>
        );
    }
}


Ring.propTypes = {
    icon: PropTypes.string,
    color1: PropTypes.string,
    color2: PropTypes.string,
    text: PropTypes.string
};

Ring.defaultProps = {
    color1: '#ffffff',
    color2: '#78c91f'
};

export default Ring;
