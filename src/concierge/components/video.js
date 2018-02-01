import React, { Component, Fragment } from 'react';

import PeerConnection from '../../shared/utils/peerConnection';

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

        setTimeout(() => {
            this.peerConnection = new PeerConnection('concierge', stream, this.gotremoteStream);
        }, 2000);
    }

    gotremoteStream = (stream) => {
        this.myvideo.srcObject = stream;
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
            <Fragment>
                <video
                    autoPlay
                    ref={video => this.myvideo = video}
                />
                <video
                    autoPlay
                    ref={video => this.conciergevideo = video}
                />
            </Fragment>
        );
    }
}

export default Video;