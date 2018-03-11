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

        const { turn_credetnials } = emitter;

        if (turn_credetnials) {
            config.iceServers.push({
                urla: `turn:${BACKEND_IP}:3478?transport=tcp`,
                credential: turn_credetnials.password,
                username: turn_credetnials.username
            });

            config.iceServers.push({
                urla: `turn:${BACKEND_IP}:3478?transport=udp`,
                credential: turn_credetnials.password,
                username: turn_credetnials.username
            });
        }

        this.candidates = [];

        this.emitter = emitter;

        this.pc = new RTCPeerConnection(config);

        this.pc.ontrack = (event) => {
            this.emitter.emit('remote_stream', event && event.streams && event.streams[0]);
        };

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

    addStream = (stream) => {
        stream.getTracks().forEach((track) => {
            this.pc.addTrack(
                track,
                stream
            );
        });
    }

    subscribeEvents = () => {
        this.emitter.addListener('offer', this.createAnswer);
        this.emitter.addListener('answer', (msg) => {
            this.pc.setRemoteDescription(new RTCSessionDescription(msg));
        });
        this.emitter.addListener('candidate', (msg) => {
            const { id } = msg;
            if (id) {
                return this.candidates.push(msg);
            }

            this.addCandidates();
        });
    }

    close = () => {
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
        if (!restart && this.dc) {
            this.dc.close();
        }
        this.dc = this.pc.createDataChannel('RTCDataChannel', null);

        this.dc.onmessage = (event) => {
            this.emitter.emit('dc_message', event);
        };

        this.dc.onclose = function (e) {
            console.error(e); //eslint-disable-line
        };

        this.dc.onerror = function (e) {
            console.error(e); //eslint-disable-line
        };

        const offerOptions = {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        };

        restart && (offerOptions.iceRestart = true);

        this.pc.oniceconnectionstatechange = () => {
            if (this.pc) {
                if (this.pc.iceConnectionState === 'failed') {
                    this.createOffer(true);
                }
            }
        };

        /* this.pc.onicecandidate = (event) => {
            if (event.candidate) {

                const { sdpMLineIndex, candidate, sdpMid } = event.candidate;

                this.emitter.sendMessage({
                    type: 'candidate',
                    id: sdpMid,
                    label: sdpMLineIndex,
                    candidate: candidate
                });
            }
        }; */

        this.pc.createOffer(offerOptions)
            .then((desc) => {
                this.candidates = [];
                this.pc.setLocalDescription(desc);
                this.emitter.sendMessage(desc);
            }, errorHandler('createOffer'));
    }

    createAnswer = (msg) => {
        if (this.dc) {
            this.dc.close();
        }

        this.pc.ondatachannel = (event) => {
            this.dc = event.channel;

            this.dc.onopen = () => {
                this.emitter.emit('dc_opened');
            };

            this.dc.onclose = function (e) {
                console.error(e); //eslint-disable-line
            };

            this.dc.onerror = function (e) {
                console.error(e); //eslint-disable-line
            };
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
                    sendFileByChunks(remainingDataURL);
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