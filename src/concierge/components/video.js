import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setLocalStream } from '../redux/actions/peerConnection';

class Video extends Component {
    constructor() {
        super();

        this.state = {
            audio: true,
            video: true
        };
    }

    gotStream = (stream) => {
        const { currentPeer: { peer }, msg, setLocalStreamDispatch } = this.props;

        setLocalStreamDispatch(stream);

        peer.createAnswer(msg);
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
            currentPeer: { peer, localStream },
            setLocalStreamDispatch 
        } = this.props;
        
        this.video.pause();

        if (localStream) {
            localStream.getTracks().map(track => track.stop());
        }

        peer.close();
        setLocalStreamDispatch(null);
    }

    hangup = () => {
        const { setLocalStreamDispatch } = this.props;
        this.video.pause();
        setLocalStreamDispatch(null);
    }

    componentDidMount() {
        this.start();
    }

    componentWillUnmount() {
        this.video.pause();
    }

    componentDidUpdate() {
        const { currentPeer: { remoteStream } } = this.props;

        this.video && (this.video.srcObject = remoteStream);
    }

    render() {
        return (
            <video
                autoPlay
                ref={video => this.video = video}
            />
        );
    }
}

Video.propTypes = {
    msg: PropTypes.shape({}).isRequired,
    currentPeer: PropTypes.shape({
        peer: PropTypes.shape({}).isRequired,
        localStream: PropTypes.shape({}),
        remoteStream: PropTypes.shape({}),
    }).isRequired,
    setLocalStreamDispatch: PropTypes.func.isRequired
};

function mapStoreToProps(store) {
    return {
        currentPeer: store.currentPeer,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setLocalStreamDispatch: setLocalStream
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(Video);