import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import PeerConnection from '../../../shared/utils/peerConnection';
import { Button, Loader, FileView } from '../../../shared/components/';
import Events from '../Events/';
import LoaderComponent from './components/loader';
import BusyComponent from './components/busy';
import OnHold from './components/holdon';

import styles from './index.m.scss';

const messages = defineMessages({
    hangUp: {
        id: 'Main.call.hangUp',
        defaultMessage: 'Hang up'
    },
    hideVideo: {
        id: 'Main.call.hideVideo',
        defaultMessage: 'Hide video'
    },
    showVideo: {
        id: 'Main.call.showVideo',
        defaultMessage: 'Show video'
    }
});

class Video extends Component {
    constructor() {
        super();

        this.state = {
            audio: true,
            video: true,
            error: null,
            remoteStream: null,
            remoteStreamLoaded: false,
            busy: false,
            onhold: false
        };
    }

    gotStream = (stream) => {
        const { currentUserId } = this.props;
        this.localStream = stream;
        this.myvideo && (this.myvideo.srcObject = stream);

        this.peerConnection.wantToCall(currentUserId);
        this.wantCallTimeout = setTimeout(this.busyHandler, 30000);
    }

    createOffer = () => {
        this.wantCallTimeout && clearTimeout(this.wantCallTimeout);
        this.peerConnection.addStream(this.localStream);
        this.peerConnection.createOffer();
    }

    setRemoteVideostream = () => {
        const { remoteStream } = this.state;

        if (this.conciergevideo) {
            this.conciergevideo.srcObject = remoteStream;

            this.conciergevideo.addEventListener('loadeddata', () => {
                this.setState({
                    remoteStreamLoaded: true
                });
            }, false);
        }
    }

    gotremoteStream = (stream) => {
        const { remoteStream } = this.state;

        this.wantCallTimeout && clearTimeout(this.wantCallTimeout);

        if (remoteStream !== stream) {
            this.setState({
                remoteStream: stream
            }, this.setRemoteVideostream);
        }
    }

    errorHandler(error, constraints) {
        function errorMsg(msg, error) {
            alert(msg, ' ', error);
        }

        if (error.name === 'ConstraintNotSatisfiedError') {
            errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
                constraints.video.width.exact + ' px is not supported by your device.');
        } else if (error.name === 'PermissionDeniedError') {
            errorMsg('Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
        }
        errorMsg('getUserMedia error: ' + error.name, error);
    }

    start = async () => {
        const { video, audio } = this.state;
        const constraints = window.constraints = {
            audio,
            video
        };

        try {
            const stream = await this.peerConnection.getMedia(constraints);
            this.gotStream(stream);
        } catch (error) {
            if (!this.allreadyError) {
                this.allreadyError = true;
                return this.start();
            }

            this.allreadyError = false;
            this.errorHandler(error, constraints);
        }
    }

    deinit = () => {
        this.wantCallTimeout && clearTimeout(this.wantCallTimeout);

        this.myvideo && this.myvideo.pause();
        this.conciergevideo && this.conciergevideo.pause();

        if (this.localStream) {
            const tracks = this.localStream.getTracks();

            if (typeof tracks === 'undefined') {
                this.localStream.stop();
            } else {
                tracks.map(track => track.stop());
            }

            this.localStream = null;
        }

        this.goToRateScreenTimeout = setTimeout(this.goToRate, 2000);
    }

    goToRate = (call_id) => {
        const { history } = this.props;

        this.goToRateScreenTimeout && clearTimeout(this.goToRateScreenTimeout);

        this.peerConnection && this.peerConnection.close();

        const pushState = call_id ? { call_id, step: 1 } : { step: -1 };

        history.push('/rate', pushState);
    }

    hangup = () => {
        const {
            currentPeer: {
                emitter
            }
        } = this.props;

        emitter.sendMessage({
            type: 'hang_up'
        });
    }

    busyHandler = () => {
        this.wantCallTimeout && clearTimeout(this.wantCallTimeout);
        this.setState({
            busy: true
        });
    }

    initEvents = (emitter) => {
        emitter.addListener('ready_call', this.createOffer);
        emitter.addListener('remote_stream', this.gotremoteStream);

        emitter.addListener('call_ended', ({ call_id }) => {
            this.wantCallTimeout && clearTimeout(this.wantCallTimeout);
            this.deinit();
            this.goToRate(call_id);
        });

        emitter.addListener('hang_up', ({ call_id }) => {
            this.wantCallTimeout && clearTimeout(this.wantCallTimeout);
            this.deinit();
            this.goToRate(call_id);
        });

        emitter.addListener('busy', this.busyHandler);

        emitter.addListener('concierge_offline', () => {
            this.wantCallTimeout && clearTimeout(this.wantCallTimeout);
            this.setState({
                busy: true
            });
        });

        emitter.addListener('toggle_stream', ({ state }) => {
            this.setState({
                onhold: state
            }, this.setRemoteVideostream);
        });

        emitter.addListener('dc_events', ({ events }) => {
            this.setState({
                events
            });
        });
    }

    init = async (props) => {
        const {
            currentPeer: {
                emitter,
                creating
            }
        } = props || this.props;

        if (creating) {
            return creating;
        }

        this.initEvents(emitter);

        this.peerConnection = new PeerConnection(emitter);

        this.start();
    }

    toggleVideo = () => {
        const { currentPeer: { emitter } } = this.props;
        this.setState({
            video: !this.state.video
        }, () => {
            const { video: videoState } = this.state;

            this.localStream.getVideoTracks()[0].enabled = videoState;

            emitter.sendMessage({ type: 'toggle_stream', state: videoState });
        });
    }

    componentDidMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps) {
        const { currentPeer: { error } } = nextProps;

        if (error) {
            throw error;
        }

        !this.peerConnection && this.init(nextProps);
    }

    componentWillUnmount() {
        const { currentPeer: { emitter } } = this.props;

        emitter.removeAllListeners();
    }

    render() {
        const { intl: { formatMessage } } = this.props;
        const { error, video, remoteStream,
            remoteStreamLoaded, busy, onhold,
            events
        } = this.state;

        return (
            <div className={styles.mainContainer}>
                <aside className={styles.controlContainer} />
                <div className={styles.mainVideo}>
                    <Loader
                        noBackGround={!busy}
                        Component={busy ? BusyComponent : LoaderComponent}
                        condition={remoteStream}
                    >
                        <Loader
                            Component={OnHold}
                            condition={!onhold}
                        >
                            <Fragment>
                                {!error ? (
                                    <Fragment>
                                        <video
                                            autoPlay
                                            ref={video => this.conciergevideo = video}
                                            className={classNames({
                                                [styles.displayNone]: !remoteStreamLoaded || (events && events.length)
                                            })}
                                        />
                                        {!remoteStreamLoaded && <LoaderComponent />}
                                    </Fragment>
                                ) :
                                    <div>{error.toString()}</div>}
                                <FileView
                                    className={styles.picture}
                                    showOnFile={true}
                                    peer={this.peerConnection}
                                />
                                <Events events={events} />
                            </Fragment>
                        </Loader>
                    </Loader>
                </div>
                <aside className={styles.controlContainer}>
                    <Button
                        icon='hangup'
                        color2='#E16950'
                        className={styles.button}
                        text={formatMessage(messages.hangUp)}
                        onClick={this.hangup}
                        pressed={false}
                        iconScale={0.6}
                    />
                    <Button
                        icon={video ? 'hidevideo' : 'showvideo'}
                        color2={video ? '#FABE7D' : '#37AA69'}
                        className={styles.button}
                        text={formatMessage(video ? messages.hideVideo : messages.showVideo)}
                        onClick={this.toggleVideo}
                        pressed={false}
                        iconScale={0.6}
                    />
                    <div className={styles.myVideo}>
                        <video
                            autoPlay
                            muted
                            ref={video => this.myvideo = video}
                            style={{
                                display: video ? 'block' : 'none'
                            }}
                        />
                        <div
                            style={{
                                display: !video ? 'flex' : 'none'
                            }}
                        >
                            <FormattedMessage
                                id='Main.call.disabledVideo'
                                defaultMessage='Your video is disabled at the moment'
                            />
                        </div>
                    </div>
                </aside>
            </div>
        );
    }
}

Video.propTypes = {
    history: PropTypes.shape({}).isRequired,
    currentPeer: PropTypes.shape({
        emitter: PropTypes.shape({}),
        creating: PropTypes.bool
    }),
    currentUserId: PropTypes.number.isRequired,
    intl: PropTypes.shape({}).isRequired
};

function mapStoreToProps(store) {
    return {
        currentPeer: {
            emitter: store.currentPeer.emitter,
            error: store.currentPeer.error,
            creating: store.currentPeer.creating
        },
        currentUserId: store.currentUser.id
    };
}

export default connect(mapStoreToProps, null)(injectIntl(Video)); 