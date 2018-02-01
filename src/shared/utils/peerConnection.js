
import { BACKEND_SOCKET_URL } from '../../../config/constants';

require('webrtc-adapter');

const socket = new WebSocket(`${BACKEND_SOCKET_URL}?authorization=${window.sessionStorage.getItem('authToken')}`);

function sendMessage(messageJSON = {}) {
    socket.send(JSON.stringify(messageJSON));
}

function errorHandler(context) {
    return function (error) {
        throw new Error(`Failure in ${context}: ${error && error.toString()}`);
    };
}

function PeerConnection(owner, stream, handler) {
    const servers = null;

    const pc = new RTCPeerConnection(servers);

    pc.addStream(stream);

    pc.onicecandidate = function (event) {
        if (event.candidate) {
            const { sdpMLineIndex, sdpMid, candidate } = event.candidate;

            sendMessage({
                type: 'candidate',
                label: sdpMLineIndex,
                id: sdpMid,
                candidate: candidate,
                handler: owner
            });
        }
    };

    pc.onaddstream = function (event) {
        handler(event.stream);
    };

    if (owner === 'terminal') {
        pc.createOffer(function (desc) {
            pc.setLocalDescription(desc);

            sendMessage(desc);
        }, errorHandler('createOffer'));
    }

    socket.onmessage = function (message) {
        const msg = JSON.parse(message.data || message);

        if (msg.type === 'offer') {
            pc.setRemoteDescription(new RTCSessionDescription(msg));
            pc.createAnswer(function (desc) {
                pc.setLocalDescription(desc);
                sendMessage(desc);
            }, errorHandler('createAnswer'));
        } else if (msg.type === 'answer') {
            pc.setRemoteDescription(new RTCSessionDescription(msg));
        } else if (msg.type === 'candidate') {
            var candidate = new RTCIceCandidate({
                sdpMLineIndex: msg.label,
                candidate: msg.candidate
            });

            pc.addIceCandidate(candidate, () => {}, errorHandler('AddIceCandidate'));
        }
    };

    this.pc = pc;
}

export default PeerConnection;