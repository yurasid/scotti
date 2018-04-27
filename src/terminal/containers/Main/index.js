import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import { initEmitter } from '../../redux/actions/peerConnection';
import { Icon } from '../../../shared/components';
import styles from './index.m.scss';

class Main extends Component {
    constructor() {
        super();

        this.state = {
            height: 0,
            width: 0
        };
    }

    init = async (props) => {
        const {
            initEmitterDispatch,
            emitter,
            creating,
            currentUserId
        } = props || this.props;

        if (!emitter && currentUserId) {
            return !creating && initEmitterDispatch('terminal');
        }

        if (emitter) {
            emitter.addListener('unauthenticated', () => {
                this.reinitSockets();
            });
        }
    }

    reinitSockets = async (timeout) => {
        const { pushDispatch, emitter } = this.props;

        try {
            emitter.reInitWS(timeout);
        } catch (error) {
            return pushDispatch('/error');
        }
    }

    componentWillReceiveProps(nextProps) {
        const { emitter } = nextProps;

        !emitter && this.init(nextProps);
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

        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            connection.onchange = (event) => {
                console.log('changed', event); // eslint-disable-line
                return this.reinitSockets(true);
            };
        }

        this.init();
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
    pushDispatch: PropTypes.func.isRequired,
    emitter: PropTypes.shape({}),
    creating: PropTypes.bool,
    currentUserId: PropTypes.number
};

function mapStoreToProps(store) {
    return {
        emitter: store.currentPeer.emitter,
        creating: store.currentPeer.creating,
        currentUserId: store.currentUser.id
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        initEmitterDispatch: initEmitter,
        pushDispatch: push
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(Main);
