require('webrtc-adapter');

function sendMessage(messageJSON = {}) {
    window.socket.send(JSON.stringify(messageJSON));
}

function errorHandler(context) {
    return function (error) {
        throw new Error(`Failure in ${context}: ${error && error.toString()}`);
    };
}

class PeerConnection {
    constructor(onRemoteVideoHandler) {
        const servers = null;

        this.pc = new RTCPeerConnection(servers);



        this.pc.onicecandidate = function (event) {
            if (event.candidate) {
                const { sdpMLineIndex, candidate } = event.candidate;

                sendMessage({
                    type: 'candidate',
                    label: sdpMLineIndex,
                    candidate: candidate
                });
            }
        };

        this.pc.onaddstream = function (event) {
            onRemoteVideoHandler(event.stream);
        };
    }

    addStream = (stream) => {
        this.pc.addStream(stream);
    }

    subscribeOnSockets = (onOfferHandler) => {
        window.socket.onmessage = (message) => {
            const msg = JSON.parse(message.data || message);

            switch (msg.type) {
                case 'offer':
                    onOfferHandler ? onOfferHandler(msg) : this.createAnswer(msg);
                    break;

                case 'answer':
                    this.pc.setRemoteDescription(new RTCSessionDescription(msg));
                    break;

                case 'candidate':
                    this.pc.addIceCandidate(new RTCIceCandidate({
                        sdpMLineIndex: msg.label,
                        candidate: msg.candidate
                    }), () => { }, errorHandler('AddIceCandidate'));
                    break;

                default:
                    break;
            }
        };
    }

    close = () => {
        window.socket.close();
        this.pc.close();
        sendMessage({ type: 'hangup' });
    }

    createOffer = () => {
        this.pc.createOffer((desc) => {
            this.pc.setLocalDescription(desc);
            sendMessage(desc);
        }, errorHandler('createOffer'));
    }

    createAnswer = (msg) => {
        this.pc.setRemoteDescription(new RTCSessionDescription(msg));
        this.pc.createAnswer((desc) => {
            this.pc.setLocalDescription(desc);
            sendMessage(desc);
        }, errorHandler('createAnswer'));
    }
}

export default PeerConnection;