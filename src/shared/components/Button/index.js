import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '../';

import styles from './index.scss';

class Button extends Component {
    constructor() {
        super();

        this.state = {
            active: false,
            height: 0,
            width: 0
        };
    }

    mouseDown = () => {
        const { disabled } = this.props;

        if (disabled) {
            return true;
        }
        this.setState({
            active: true
        });
    }

    mouseUp = () => {
        const { onClick, pressed, active, disabled } = this.props;

        if (disabled) {
            return true;
        }

        this.setState({
            active: pressed ? !active : active
        }, onClick);
    }

    componentDidMount() {
        const { scale } = this.props;
        const {
            width: containerWidth,
            height: containerHeight
        } = this.container.getBoundingClientRect();

        const width = containerWidth * scale;
        const height = containerHeight * scale;

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
            text,
            style,
            className,
            active: propsActive,
            textColor,
            allInside,
            iconScale,
            disabled
        } = this.props;

        const {
            active,
            height,
            width,
        } = this.state;

        const iconProps = {};
        const containerStyle = { ...style };
        const textStyle = { color: textColor };
        const minMeasure = height < width ? height : width;
        const containerClassNames = {
            [styles.button]: true
        };

        const containerProps = {
            ref: container => this.container = container,
            className: classNames(containerClassNames),
            style: containerStyle
        };

        containerProps.onMouseDown = this.mouseDown;
        containerProps.onTouchStart = this.mouseDown;
        containerProps.onMouseUp = this.mouseUp;
        containerProps.onTouchEnd = this.mouseUp;

        const colorCondition = (active || propsActive) && color1 !== 'transparent';

        if (minMeasure) {

            if (allInside) {
                containerStyle.color = color1;
                containerProps.className = classNames(containerClassNames, className, {
                    [styles.disabled]: !!disabled
                });
                containerStyle.backgroundColor = colorCondition ? color2 : color1;
                containerStyle.color = colorCondition ? color1 : color2;
            }

            if (icon) {
                !allInside && (iconProps.className = classNames(className, {
                    [styles.disabled]: !!disabled
                }));
                iconProps.height = minMeasure * iconScale;
                
                iconProps.color = colorCondition ? color1 : color2;
                iconProps.backgroundColor = colorCondition ? color2 : color1;
            }
        }

        return (
            <div { ...containerProps }>
                {icon && <Icon name={icon} {...iconProps} />}
                {text &&
                    <span
                        style={textStyle}
                        className={styles.textSpan}
                    >
                        {text}
                    </span>}
            </div>
        );
    }
}


Button.propTypes = {
    icon: PropTypes.string,
    color1: PropTypes.string,
    color2: PropTypes.string,
    text: PropTypes.string,
    textColor: PropTypes.string,
    style: PropTypes.shape({}),
    className: PropTypes.string,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    pressed: PropTypes.bool,
    scale: PropTypes.number,
    allInside: PropTypes.bool,
    disabled: PropTypes.bool,
    iconScale: PropTypes.number
};

Button.defaultProps = {
    color1: '#ffffff',
    color2: '#78c91f',
    style: {},
    onClick: () => { },
    pressed: true,
    scale: 1,
    iconScale: 1
};

export default Button;
