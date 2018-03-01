import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import classNames from 'classnames';

import { setLocalStream, setCurrentFile, setRemoteStream } from '../../redux/actions/peerConnection';
import { setCurrentTerminal } from '../../redux/actions/terminals';
import { Ringing, Button } from '../../../shared/components';
import { File, TerminalInfo } from '../';

import styles from './index.scss';

const messages = defineMessages({
    startSession: {
        id: 'Call.startSession',
        defaultMessage: 'Start the session'
    }
});

class Video extends Component {
    constructor() {
        super();

        this.state = {
            audio: false,
            video: true,
            ready: false,
            shareButtonEnabled: false
        };
    }

    gotStream = (stream) => {
        const { currentPeer: { peer }, setLocalStreamDispatch } = this.props;

        peer.addStream(stream);

        setLocalStreamDispatch(stream);
    }

    start() {
        const { video, audio } = this.state;

        navigator.mediaDevices.getUserMedia({ video, audio })
            .then(this.gotStream)
            .catch(function () {
                alert('getUserMedia() failed');
            });
    }

    deinitComponent = () => {
        const {
            currentPeer: { localStream },
            setLocalStreamDispatch,
            setCurrentTerminalDispatch,
            setRemoteStreamDispatch
        } = this.props;

        this.video && this.video.pause();

        if (localStream) {
            const tracks = localStream.getTracks();

            if (typeof tracks === 'undefined') {
                localStream.stop();
            } else {
                tracks.map(track => track.stop());
            }

            setLocalStreamDispatch(null);
            setRemoteStreamDispatch(null);
            setCurrentTerminalDispatch(undefined);
        }
    }

    hangup = async () => {
        const { pushDispatch, currentPeer: { emitter, peer, file } } = this.props;

        if (file) {
            await peer.sendFile();
        }

        emitter.sendMessage({
            type: 'hang_up',
            call_id: this.callId
        });

        pushDispatch('/');
    }

    handleFileInputChange = async () => {
        const { currentPeer: { peer }, setCurrentFileDispatch } = this.props;
        const file = this.fileInput.files[0];

        if (!file) {
            return false;
        }

        const fileDataURL = await peer.getFileDataURL(file);

        setCurrentFileDispatch(fileDataURL);
    }

    componentDidMount() {
        const { currentPeer: { emitter } } = this.props;
        this.start();

        /* emitter.addListener('toggle_stream', () => {
            this.setState({
                remoteMuted: !this.state.remoteMuted
            });
        }); */

        emitter.addListener('hang_up', () => {
            const { pushDispatch } = this.props;

            this.deinitComponent();
            pushDispatch('/');
        });

        emitter.addListener('call_started', (msg) => {
            this.callId = msg['call_id'];
        });

        emitter.addListener('dc_opened', () => {
            this.setState({
                shareButtonEnabled: true
            });
        });
    }

    componentDidUpdate() {
        const { currentPeer: { remoteStream } } = this.props;

        this.video && (this.video.srcObject = remoteStream);
    }

    componentWillUnmount() {
        this.deinitComponent();
    }

    render() {
        const {
            intl: { formatMessage },
            currentTerminal,
            currentPeer: { file }
        } = this.props;
        const { ready, shareButtonEnabled } = this.state;

        let element = (
            <div className={styles.container}>
                <TerminalInfo terminal={currentTerminal} className={styles.terminalInfo} />
                <Ringing
                    icon='logodef'
                    color='#75df00'
                    active={true}
                />
                <div className={styles.controlPanel}>
                    <Button
                        icon='showvideo'
                        color1='#75df00'
                        color2='#ffffff'
                        textColor='#ffffff'
                        className={styles.button}
                        text={formatMessage(messages.startSession)}
                        style={{
                            alignSelf: 'stretch'
                        }}
                        pressed={false}
                        iconScale={0.7}
                        onClick={() => {
                            this.setState({ ready: true }, () => {
                                const { currentPeer: { peer } } = this.props;

                                peer.readyForCall();
                            });
                        }}
                    />
                </div>
            </div>
        );

        if (ready) {
            element = (
                <Fragment>
                    {file && <File />}
                    <div className={styles.video}>
                        <video
                            autoPlay
                            ref={video => this.video = video}
                        />
                        <div
                            className={classNames({
                                [styles.controlPanel]: true,
                                [styles.float]: true
                            })}
                        >
                            <div>
                                <Button
                                    icon='hangup'
                                    color1='#E16950'
                                    color2='#ffffff'
                                    scale={0.7}
                                    style={{
                                        alignSelf: 'stretch'
                                    }}
                                    pressed={false}
                                    className={styles.button}
                                    onClick={this.hangup}
                                />
                                <Button
                                    icon='shareimage'
                                    color1='#009bf5'
                                    color2='#ffffff'
                                    scale={0.7}
                                    style={{
                                        alignSelf: 'stretch'
                                    }}
                                    pressed={false}
                                    disabled={!shareButtonEnabled}
                                    className={styles.button}
                                    onClick={() => {
                                        this.fileInput.click();
                                    }}
                                />
                                <form style={{ display: 'none' }}>
                                    <input
                                        ref={input => this.fileInput = input}
                                        type='file'
                                        name='files'
                                        accept='image/*'
                                        onChange={this.handleFileInputChange}
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }

        return element;
    }
}

Video.propTypes = {
    currentPeer: PropTypes.shape({
        emitter: PropTypes.shape({}).isRequired,
        peer: PropTypes.shape({}).isRequired,
        localStream: PropTypes.shape({}),
        remoteStream: PropTypes.shape({}),
        file: PropTypes.string
    }).isRequired,
    setLocalStreamDispatch: PropTypes.func.isRequired,
    setRemoteStreamDispatch: PropTypes.func.isRequired,
    setCurrentTerminalDispatch: PropTypes.func.isRequired,
    setCurrentFileDispatch: PropTypes.func.isRequired,
    pushDispatch: PropTypes.func.isRequired,
    intl: PropTypes.shape({}).isRequired,
    currentTerminal: PropTypes.shape({})
};

function mapStoreToProps(store) {
    return {
        currentPeer: {
            emitter: store.currentPeer.emitter,
            peer: store.currentPeer.peer,
            file: store.currentPeer.file,
            localStream: store.currentPeer.localStream,
            remoteStream: store.currentPeer.remoteStream
        },
        currentTerminal: store.terminals.currentTerminal
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setLocalStreamDispatch: setLocalStream,
        setRemoteStreamDispatch: setRemoteStream,
        setCurrentTerminalDispatch: setCurrentTerminal,
        setCurrentFileDispatch: setCurrentFile,
        pushDispatch: push
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(injectIntl(Video));