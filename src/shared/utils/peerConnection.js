require('webrtc-adapter');


function errorHandler(context) {
    return function (error) {
        throw new Error(`Failure in ${context}: ${error && error.toString()}`);
    };
}

class PeerConnection {
    constructor(emitter) {
        const servers = null;

        this.emitter = emitter;

        this.pc = new RTCPeerConnection(servers);

        this.pc.onicecandidate = (event) => {
            if (event.candidate) {
                const { sdpMLineIndex, candidate } = event.candidate;

                this.emitter.sendMessage({
                    type: 'candidate',
                    label: sdpMLineIndex,
                    candidate: candidate
                });
            }
        };

        this.pc.onaddstream = (event) => {
            this.emitter.emit('remote_stream', event.stream);
        };

        this.subscribeEvents();
    }

    addStream = (stream) => {
        this.pc.addStream(stream);
    }

    subscribeEvents = () => {
        this.emitter.addListener('offer', this.createAnswer);
        this.emitter.addListener('answer', (msg) => {
            this.pc.setRemoteDescription(new RTCSessionDescription(msg));
        });
        this.emitter.addListener('candidate', (msg) => {
            this.pc.addIceCandidate(new RTCIceCandidate({
                sdpMLineIndex: msg.label,
                candidate: msg.candidate
            }), () => { }, errorHandler('AddIceCandidate'));
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

    createOffer = () => {
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

        this.pc.createOffer((desc) => {
            this.pc.setLocalDescription(desc);
            this.emitter.sendMessage(desc);
        }, errorHandler('createOffer'));
    }

    createAnswer = (msg) => {
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

        this.pc.setRemoteDescription(new RTCSessionDescription(msg));
        this.pc.createAnswer((desc) => {
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