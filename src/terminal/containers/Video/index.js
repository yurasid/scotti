import React, { Component } from 'react';

class Video extends Component {
    constructor() {
        super();

        this.state = {
            audio: true,
            video: true
        };
    }

    componentDidMount() {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        var constraints = {
            audio: true,
            video: true
        };
        var video = document.querySelector('video');

        function successCallback(stream) {
            window.stream = stream; // stream available to console
            if (window.URL) {
                video.src = window.URL.createObjectURL(stream);
            } else {
                video.src = stream;
            }
        }

        function errorCallback() {
            
        }

        navigator.getUserMedia(constraints, successCallback, errorCallback);
    }

    render() {
        return (
            <video autoPlay></video>
        );
    }
}

export default Video;