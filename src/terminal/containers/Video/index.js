import React, { Component } from 'react';

import PeerConnection from '../../../shared/utils/peerConnection';
import { Button } from '../../../shared/components/';

import styles from './index.scss';

class Video extends Component {
    constructor() {
        super();

        this.state = {
            audio: true,
            video: true
        };
    }

    gotStream = (stream) => {
        this.localeStream = stream;
        this.myvideo.srcObject = stream;
        this.conciergevideo.srcObject = stream;

        setTimeout(() => {
            this.peerConnection = new PeerConnection('terminal', stream, this.gotremoteStream);
        }, 2000);
    }

    gotremoteStream = (stream) => {
        this.conciergevideo.srcObject = stream;
    }

    start() {
        const { video, audio } = this.state;

        navigator.mediaDevices.getUserMedia({ video, audio })
            .then(this.gotStream)
            .catch(function () {
                alert('getUserMedia() failed');
            });
    }

    hangup = () => {
        this.peerConnection.pc.close();
    }

    componentDidMount() {
        this.start();
    }

    componentWillUnmount() {
        this.myvideo.pause();
        this.conciergevideo.pause();

        if (this.localeStream) {
            this.localeStream.getTracks().map(track => track.stop());
        }
    }

    render() {
        return (
            <div className={styles.mainContainer}>
                <div className={styles.mainVideo}>
                    <video
                        autoPlay
                        ref={video => this.conciergevideo = video}
                    />
                </div>
                <div className={styles.controlContainer}>
                    <Button icon='bell' />
                    <video
                        autoPlay
                        ref={video => this.myvideo = video}
                    />
                </div>
            </div>
        );
    }
}

export default Video;