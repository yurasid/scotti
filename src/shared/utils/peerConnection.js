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

    addCandidates = () => {
        this.candidates.map((candidate) => {
            this.pc.addIceCandidate(new RTCIceCandidate({
                sdpMLineIndex: candidate.label,
                candidate: candidate.candidate
            }), () => { }, errorHandler('AddIceCandidate'));
        });
    }

    subsctibeDCEvents = () => {
        this.dc.onopen = () => {
            this.emitter.emit('dc_opened');
        };

        this.dc.onmessage = (event) => {
            this.emitter.emit('dc_message', event);
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
        this.emitter.addListener('offer', this.createAnswer);
        this.emitter.addListener('answer', (msg) => {
            this.pc.setRemoteDescription(new RTCSessionDescription(msg));
        });
        this.emitter.addListener('candidate', (msg) => {
            const { id, candidate } = msg;
            if (id) {
                return candidate && this.candidates.push(msg);
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
                this.candidates = [];
                this.pc.setLocalDescription(desc);
                this.emitter.sendMessage(desc);
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

        this.pc.createAnswer()
            .then((desc) => {
                this.candidates = [];
                this.pc.setLocalDescription(desc);
                this.emitter.sendMessage(desc);
            }, errorHandler('createAnswer'));
    }

    getFileDataURL = (file) => {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                return resolve(event.target.result);
            };

            reader.onerror = reject;
        });
    }

    sendFile = async (fileDataURL = '') => {
        const dc = this.dc;

        const chunkSize = 16384;

        function sendFileByChunks(text, resolve) {
            const data = {};

            if (text.length > chunkSize) {
                data.message = text.slice(0, chunkSize);
            } else {
                data.message = text;
                data.last = true;
            }

            dc.send(JSON.stringify(data));

            const remainingDataURL = text.slice(data.message.length);

            if (remainingDataURL.length) {
                return setTimeout(function () {
                    sendFileByChunks(remainingDataURL, resolve);
                }, 0);
            }

            return resolve();
        }

        return await new Promise((resolve) => {
            sendFileByChunks(fileDataURL, resolve);
        });

    }
}

export default PeerConnection;