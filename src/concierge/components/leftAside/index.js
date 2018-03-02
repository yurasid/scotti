import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { TerminalInfo } from '../index';

import { Icon, Button } from '../../../shared/components';

import styles from './index.scss';

class Aside extends Component {
    constructor() {
        super();

        this.state = {};
    }

    componentDidUpdate() {
        const { localStream } = this.props;

        localStream && this.video && (this.video.srcObject = localStream);
    }

    pause = () => {
        this.setState({
            pause: !this.state.pause
        }, () => {
            const { pause } = this.state;
            const { localStream, emitter } = this.props;

            localStream.getVideoTracks().map((track) => {
                track.enabled = !pause;
            });

            localStream.getAudioTracks().map((track) => {
                track.enabled = !pause;
            });

            emitter.sendMessage({ type: 'toggle_stream', state: pause });
        });
    }

    render() {
        const {
            localStream,
            remoteStream,
            currentTerminal
        } = this.props;
        const { pause } = this.state;

        return (
            <aside className='block16 left blue'>
                <div className={styles.terminalInfo}>
                    <TerminalInfo terminal={currentTerminal} className={styles.terminalInfo} />
                </div>
                <div className={classNames({
                    [styles.myVideoContainer]: true,
                    [styles.withVideo]: !!localStream && !pause
                })}>
                    <div
                        className={styles.myVideo}
                        style={{
                            display: localStream ? 'block' : 'none'
                        }}
                    >
                        <video
                            autoPlay
                            muted
                            ref={video => this.video = video}
                        />
                    </div>
                    <div
                        className={styles.overlay}
                        style={{
                            display: pause ? 'flex' : 'none'
                        }}
                    >
                        <Icon name='logorings' height={72} />
                        <FormattedMessage
                            id='Dashboard.call.onHold'
                            defaultMessage='Current session is in hold mode now'
                        />
                    </div>
                    {localStream && remoteStream &&
                        <Button
                            icon={pause ? 'showvideo' : 'conciergepause'}
                            color1={pause ? '#75df00' : '#FABE7D'}
                            color2='#ffffff'
                            className={styles.button}
                            scale={0.15}
                            pressed={false}
                            onClick={this.pause}
                        />
                    }
                    {!localStream &&
                        <div className={styles.noSession}>
                            <Icon name='logorings' height={72} />
                            <FormattedMessage
                                id='Dashboard.call.noSession'
                                defaultMessage='There is no active sessions at the moment'
                            />
                        </div>
                    }
                </div>
            </aside>
        );
    }
}

Aside.propTypes = {
    localStream: PropTypes.shape({}),
    emitter: PropTypes.shape({}),
    remoteStream: PropTypes.shape({}),
    currentTerminal: PropTypes.shape({})
};

function mapStoreToProps(store) {
    return {
        emitter: store.currentPeer.emitter,
        localStream: store.currentPeer.localStream,
        remoteStream: store.currentPeer.remoteStream,
        currentTerminal: store.terminals.currentTerminal
    };
}

export default connect(mapStoreToProps, null)(Aside);