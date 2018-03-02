import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import { Icon } from '../../../shared/components';
import styles from './index.scss';

class Main extends Component {
    constructor() {
        super();

        this.state = {
            height: 0,
            width: 0
        };
    }

    componentDidMount() {
        const {
            width,
            height
        } = this.container.getBoundingClientRect();

        this.setState({
            width,
            height
        });
    }

    componentDidCatch() {
        const { pushDispatch } = this.props;
        
        pushDispatch('/login');
    }

    render() {
        const { children } = this.props;

        const {
            height,
        } = this.state;

        const vmin = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
        const iconScottiProps = { color: '#8b8b8b', height: vmin * 0.07 };
        const iconLogoProps = { color: '#009bf5' };

        if (height) {
            iconLogoProps.height = height;
        }


        return (
            <Fragment>
                <header>
                    <aside />
                    <div className={styles.headerBlock}>
                        <div className={styles.headerLeftBlock}>
                            <span className={styles.headerFirstSpan}>scotti</span>
                            <FormattedMessage
                                id='Main.logoMessage'
                                defaultMessage='realtime concierge'
                            >
                                {(txt) => (
                                    <span className={styles.headerSecondSpan}>
                                        {txt}
                                    </span>
                                )}
                            </FormattedMessage>
                        </div>
                        <div
                            className={styles.iconContainer}
                            ref={container => this.container = container}
                        >
                            <Icon name='logorings' {...iconLogoProps} />
                        </div>
                    </div>
                    <aside />
                </header>
                <main>
                    {children}
                </main>
                <footer>
                    <Icon name='scottilogo' {...iconScottiProps} />
                    <span className={styles.footerSpan}>
                        <FormattedMessage
                            id='Main.logoMessageFull'
                            defaultMessage='realtime concierge service'
                        />
                    </span>
                </footer>
            </Fragment>
        );
    }
}

Main.propTypes = {
    children: PropTypes.element,
    pushDispatch: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        pushDispatch: push
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(Main);
