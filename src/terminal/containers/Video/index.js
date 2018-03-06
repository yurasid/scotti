import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import PeerConnection from '../../../shared/utils/peerConnection';
import { Button, Loader } from '../../../shared/components/';
import LoaderComponent from './components/loader';
import BusyComponent from './components/busy';
import OnHold from './components/holdon';

import styles from './index.scss';

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
            busy: false,
            onhold: false
        };
    }

    gotStream = (stream) => {
        const { currentUserId } = this.props;
        this.localStream = stream;
        this.myvideo && (this.myvideo.srcObject = stream);

        this.peerConnection.wantToCall(currentUserId);
    }

    createOffer = () => {
        this.peerConnection.addStream(this.localStream);
        this.peerConnection.createOffer();
    }

    setRemoteVideostream = () => {
        const { remoteStream } = this.state;

        this.conciergevideo && (this.conciergevideo.srcObject = remoteStream);
    }

    gotremoteStream = (stream) => {
        const { remoteStream } = this.state;

        if (remoteStream !== stream) {
            this.setState({
                remoteStream: stream
            }, this.setRemoteVideostream);
        }
    }

    start() {
        const { video, audio } = this.state;

        navigator.mediaDevices.getUserMedia({ video, audio })
            .then(this.gotStream)
            .catch(function (err) {
                alert(err.toString());
            });
    }

    deinit = () => {
        const { history } = this.props;

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

        this.peerConnection && this.peerConnection.close();

        const pushState = this.callId ? { call_id: this.callId } : { step: -1 };

        delete this.callId;

        history.push('/rate', pushState);
    }

    hangup = () => {
        const { currentPeer: { emitter } } = this.props;

        emitter.sendMessage({
            type: 'hang_up',
            call_id: this.callId
        });

        this.deinit();
    }

    initEvents = (emitter) => {
        let arrayOfChunks = [];

        emitter.addListener('ready_call', this.createOffer);
        emitter.addListener('remote_stream', this.gotremoteStream);
        emitter.addListener('call_started', (msg) => {
            this.callId = msg['call_id'];
        });
        emitter.addListener('hang_up', () => {
            this.deinit();
        });

        emitter.addListener('busy', () => {
            this.setState({
                busy: true
            });
        });

        emitter.addListener('concierge_offline', () => {
            this.setState({
                busy: true
            });
        });

        emitter.addListener('toggle_stream', ({ state }) => {
            this.setState({
                onhold: state
            }, this.setRemoteVideostream);
        });

        emitter.addListener('dc_message', (event) => {
            let data = {};

            try {
                data = JSON.parse(event.data);
            } catch (error) {
                return false;
            }

            const { message, last } = data;

            arrayOfChunks.push(message);

            if (last) {
                const received = arrayOfChunks.join('');
                arrayOfChunks = [];

                this.setState({
                    imgUrl: received
                });
            }
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
        const { error, video, remoteStream, busy, imgUrl, onhold } = this.state;

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
                                {!error ? <video
                                    autoPlay
                                    ref={video => this.conciergevideo = video}
                                /> :
                                    <div>{error.toString()}</div>}
                                {imgUrl &&
                                    <div className={styles.picture}>
                                        <img src={imgUrl} />
                                    </div>
                                }
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