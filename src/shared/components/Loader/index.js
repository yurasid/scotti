import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

class Loader extends Component {
    constructor(props) {
        super();

        const { condition } = props;

        this.state = {
            loaded: !!condition
        };
    }

    componentWillReceiveProps(nextProps) {
        const { condition } = nextProps;
        const { loaded } = this.state;

        if (loaded !== !!condition) {
            this.setState({
                loaded: !!condition
            });
        }
    }

    render() {
        const { children, Component, noBackGround } = this.props;

        const {
            loaded
        } = this.state;

        const style = {};

        if (noBackGround) {
            style.backgroundColor = 'transparent';
        }

        return loaded ? children : (
            <div
                className={styles.loader}
                style={style}
            >
                <Component />
            </div>
        );
    }
}

Loader.propTypes = {
    children: PropTypes.element,
    Component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    condition: PropTypes.any,
    noBackGround: PropTypes.bool
};

export default Loader;
