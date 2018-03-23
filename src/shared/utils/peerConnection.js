import { BACKEND_IP } from '../../../config/constants';

require('webrtc-adapter');

function errorHandler(context) {
    return function (error) {
        throw new Error(`Failure in ${context}: ${error && error.toString()}`);
    };
}

class PeerConnection {
    constructor(emitter) {
        const config = {
            iceTransportPolicy: 'all',
            iceServers: [
                { urls: `stun:${BACKEND_IP}:3478` }
            ]
        };

        const { turn_credentials } = emitter;

        if (turn_credentials) {
            config.iceServers.push({
                urls: `turn:${BACKEND_IP}:3478?transport=udp`,
                credential: turn_credentials.password,
                username: turn_credentials.username
            });

            config.iceServers.push({
                urls: `turn:${BACKEND_IP}:3478?transport=tcp`,
                credential: turn_credentials.password,
                username: turn_credentials.username
            });
        }

        this.candidates = [];

        this.emitter = emitter;

        this.pc = new RTCPeerConnection(config);

        this.subscribeEvents();
    }

    addCandidates = (singleCandidate) => {
        const addIceCandidate = (candidate) => {
            this.pc.addIceCandidate(new RTCIceCandidate({
                sdpMLineIndex: candidate.label,
                candidate: candidate.candidate
            }), () => { }, errorHandler('AddIceCandidate'));
        };

        this.candidates.map(addIceCandidate);
        this.candidates = [];

        singleCandidate && addIceCandidate(singleCandidate);
    }

    subsctibeDCEvents = () => {
        this.dc.onopen = () => {
            this.emitter.emit('dc_opened');
        };

        this.dc.onmessage = (event) => {
            let data;

            try {
                data = JSON.parse(event.data);
            } catch (error) {
                return false;
            }

            const { type, ...endOfMessage } = data;

            if (type === 'file') {
                this.emitter.emit('dc_file', endOfMessage);
            }

            if (type === 'fileReceived') {
                this.emitter.emit('dc_fileReceived', endOfMessage);
            }
        };

        this.dc.onoppen = (event) => {
            this.emitter.emit('dc_message', event);
        };

        this.dc.onclose = function (e) {
            console.error(e); //eslint-disable-line
        };

        this.dc.onerror = function (e) {
            console.error(e); //eslint-disable-line
        };
    }

    subscribeEvents = () => {
        this.emitter.addListener('call_started', (msg) => {
            this.callInfo = msg;
        });
        this.emitter.addListener('offer', this.createAnswer);
        this.emitter.addListener('answer', (msg) => {
            this.pc.setRemoteDescription(new RTCSessionDescription(msg));
            this.registerAtOnce = true;
        });
        this.emitter.addListener('candidate', (msg) => {
            const { id, candidate } = msg;
            if (id && candidate) {
                this.registerAtOnce ? this.addCandidates(msg) : this.candidates.push(msg);
            }

            this.addCandidates();
        });

        this.pc.ondatachannel = (event) => {
            this.dc = event.channel;

            this.subsctibeDCEvents();
        };

        this.pc.onaddstream = (event) => {
            this.emitter.emit('remote_stream', event && event.stream);
        };

        this.pc.onicecandidate = (event) => {
            if (event.candidate) {

                const { sdpMLineIndex, candidate, sdpMid } = event.candidate;

                this.emitter.sendMessage({
                    type: 'candidate',
                    id: sdpMid,
                    label: sdpMLineIndex,
                    candidate: candidate
                });
            }
        };

        this.pc.onicegatheringstatechange = () => {
            if (this.pc.iceGatheringState !== 'complete') {
                return;
            }

            this.emitter.sendMessage({
                type: 'candidate'
            });
        };

        this.pc.onnegotiationneeded = () => {
            this.negotiation = true;
        };
    }

    addStream = (stream) => {
        this.pc.addStream(stream);
    }


    close = () => {
        if (this.dc) {
            this.dc.close();
        }

        if (this.pc) {
            this.pc.close();
            this.pc = null;
        }

        this.callInfo = null;
    }

    readyForCall() {
        this.emitter.sendMessage({
            type: 'ready_call'
        });
    }

    wantToCall(id) {
        this.emitter.sendMessage({
            type: 'want_call',
            terminal_id: id
        });
    }

    createOffer = (restart) => {
        if (!this.negotiation) {
            !this.offerTimeout && (this.offerTimeout = setTimeout(() => {
                clearTimeout(this.offerTimeout);
                this.createOffer(restart);
            }, 500));
            return;
        }

        if (!restart) {
            this.dc = this.pc.createDataChannel('RTCDataChannel', null);

            this.subsctibeDCEvents();

            this.pc.oniceconnectionstatechange = () => {
                if (this.pc) {
                    if (this.pc.iceConnectionState === 'failed') {
                        this.createOffer(true);
                    }
                }
            };
        }

        const offerOptions = {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        };

        restart && (offerOptions.iceRestart = true);

        this.pc.createOffer(offerOptions)
            .then((desc) => {
                const { callInfo: { concierge_connection_id } } = this;
                this.candidates = [];
                this.registerAtOnce = false;
                this.pc.setLocalDescription(desc);
                this.emitter.sendMessage({
                    concierge_connection_id,
                    ...desc.toJSON()
                });
            }, errorHandler('createOffer'));
    }

    createAnswer = (msg) => {
        if (!this.negotiation) {
            !this.ansferTimeout && (this.ansferTimeout = setTimeout(() => {
                clearTimeout(this.ansferTimeout);
                this.createAnswer(msg);
            }, 500));
            return;
        }

        this.pc.setRemoteDescription(new RTCSessionDescription(msg));
        this.registerAtOnce = true;

        this.pc.createAnswer()
            .then((desc) => {
                this.candidates = [];
                this.pc.setLocalDescription(desc);
                this.emitter.sendMessage(desc);
            }, errorHandler('createAnswer'));
    }

    getFileDataURL = (file) => {
        const mimeFullType = file.type || '';
        const mimeType = mimeFullType.split('/')[0];

        if (!mimeType || mimeType !== 'image') {
            throw new Error('notImage');
        }

        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                return resolve(event.target.result);
            };

            reader.onerror = reject;
        });
    }

    sendDCMessage = (message) => {
        this.dc && this.dc.send(JSON.stringify(message));
    }

    sendFile = async (fileDataURL = '') => {
        const chunkSize = 16384;

        const sendFileByChunks = (text, resolve) => {
            const data = {
                type: 'file'
            };

            if (text.length > chunkSize) {
                data.message = text.slice(0, chunkSize);
            } else {
                data.message = text;
                data.last = true;
            }

            this.sendDCMessage(data);

            const remainingDataURL = text.slice(data.message.length);

            if (remainingDataURL.length) {
                return setTimeout(function () {
                    sendFileByChunks(remainingDataURL, resolve);
                }, 0);
            }

            return resolve();
        };

        return await new Promise((resolve) => {
            sendFileByChunks(fileDataURL, resolve);
        });

    }

    getMedia = async (constraints) => {
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
                const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }

                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }

        async function findMedia(videoDevices) {
            let index = 0;
            let found;

            while (videoDevices.length >= index && !found) {
                const videoDevice = videoDevices[index];
                const { deviceId } = videoDevice;

                const { video, ...elseConstraints } = constraints;

                const extendVideo = {
                    mandatory: {
                        chromeMediaSourceId: deviceId,
                    }
                };

                const baseVideo = video !== null && typeof video === 'object' && video;

                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        ...elseConstraints,
                        video: video && Object.assign({}, baseVideo || {}, extendVideo)
                    });

                    found = true;

                    return stream;
                } catch (error) {
                    if (index === videoDevices.length) {
                        throw error;
                    }
                }

                index++;
            }
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            return findMedia(videoDevices);
        } catch (error) {
            throw error;
        }


    }
}

export default PeerConnection;