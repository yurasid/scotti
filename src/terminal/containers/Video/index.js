import React, { Component } from 'react';

import PeerConnection from '../../../shared/utils/peerConnection';
import initSockets from '../../../shared/utils/webSockets';
import { Button } from '../../../shared/components/';

import styles from './index.scss';

class Video extends Component {
    constructor() {
        super();

        this.state = {
            audio: true,
            video: true,
            error: null
        };
    }

    gotStream = (stream) => {
        this.localeStream = stream;
        this.myvideo && (this.myvideo.srcObject = stream);
        this.conciergevideo && (this.conciergevideo.srcObject = stream);

        initSockets('terminal', (err) => {
            if (err) {
                return this.setState({
                    error: err
                });
            }

            this.peerConnection.addStream(stream);
            this.peerConnection.subscribeOnSockets();
            this.peerConnection.createOffer();
        });
    }

    gotremoteStream = (stream) => {
        this.conciergevideo && (this.conciergevideo.srcObject = stream);
    }

    start() {
        const { video, audio } = this.state;

        navigator.mediaDevices.getUserMedia({ video, audio })
            .then(this.gotStream)
            .catch(function (err) {
                alert(err.toString());
            });
    }

    deinitComponent = () => {
        this.myvideo.pause();
        this.conciergevideo.pause();

        if (this.localeStream) {
            this.localeStream.getTracks().map(track => track.stop());
        }

        this.peerConnection.close();
    }

    hangup = () => {
        this.deinitComponent();
    }

    componentDidMount() {
        this.peerConnection = new PeerConnection(this.gotremoteStream);
        this.start();
    }

    componentWillUnmount() {
        this.deinitComponent();
    }

    render() {
        const { error } = this.state;
        return (
            <div className={styles.mainContainer}>
                <div className={styles.mainVideo}>
                    {!error ? <video
                        autoPlay
                        ref={video => this.conciergevideo = video}
                    /> : <div>Fuck</div>}
                </div>
                <div className={styles.controlContainer}>
                    <Button icon='bell' />
                    <div className={styles.myVideo}>
                        <video
                            autoPlay
                            muted
                            ref={video => this.myvideo = video}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Video; 