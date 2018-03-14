import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Spinner, Icon } from '../';

import styles from './index.scss';

class Loader extends Component {
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

    render() {
        const { height } = this.state;
        const { className } = this.props;

        return (
            <div
                ref={ref => this.container = ref}
                className={classNames({
                    [styles.container]: true,
                    [className]: !!className
                })}
            >
                <Spinner className={styles.spinner} />
                <Icon
                    name='logodef'
                    height={height * 1.3}
                    className={styles.logo}
                    color='#75df00'
                />
            </div>
        );
    }
}

Loader.propTypes = {
    className: PropTypes.string
};

export default Loader;