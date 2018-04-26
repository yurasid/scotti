import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Icon } from '../../../shared/components';
import setCurrentPopup from '../../redux/actions/popup';

import styles from './index.m.scss';

class MenuItem extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        setCurrentPopupDispatch: PropTypes.func.isRequired,
        text: PropTypes.string,
        icon: PropTypes.string,
        name: PropTypes.string,
        active: PropTypes.bool,
        currentPopup: PropTypes.string,
        className: PropTypes.string
    };
    
    static defaultProps = {
        text: 'Unknown item',
        name: 'Unknown item',
        active: false,
        onClick: () => { }
    }

    constructor() {
        super();

        this.state = {
            height: 0,
            width: 0
        };
    }

    componentDidMount() {
        const {
            width: containerWidth,
            height: containerHeight
        } = this.container.getBoundingClientRect();

        const width = containerWidth;
        const height = containerHeight;

        this.setState({
            width,
            height
        });
    }

    onClick = () => {
        const {
            currentPopup,
            onClick,
            name,
            setCurrentPopupDispatch
        } = this.props;

        if (name) {
            const nextPopup = currentPopup !== name ? name : null;
            setCurrentPopupDispatch(nextPopup);
        }
        onClick();
    }

    render() {
        const {
            text,
            active,
            currentPopup,
            icon,
            name,
            className
        } = this.props;

        const {
            height,
            width,
        } = this.state;

        const iconProps = {};
        const minMeasure = height < width ? height : width;

        const itemActive = currentPopup === name || active;

        if (minMeasure) {
            iconProps.height = minMeasure * .7;
        }

        return (
            <div
                ref={component => this.container = component}
                className={classNames({
                    [styles.menuItem]: true,
                    [styles.active]: itemActive,
                    [styles[className]]: true
                })}
                onClick={this.onClick}
            >
                {icon && <Icon
                    name={icon}
                    color={itemActive ? '#ffffff' : '#0481C8'}
                    {...iconProps}
                />}
                <span>{text}</span>
            </div>
        );
    }
}

function mapStoreToProps(store) {
    return {
        currentPopup: store.currentPopup
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setCurrentPopupDispatch: setCurrentPopup
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(MenuItem);