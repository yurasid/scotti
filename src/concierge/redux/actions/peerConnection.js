import {
    CURRENT_PEER_SET,
    LOCAL_STREEM_SET,
    REMOTE_STREEM_SET
} from '../actionTypes';

export function setCurrentPeer(data) {
    return {
        type: CURRENT_PEER_SET,
        payload: { peer: data },
    };
}

export function setLocalStream(data) {
    return {
        type: LOCAL_STREEM_SET,
        payload: { localStream: data },
    };
}

export function setRemoteStream(data) {
    return {
        type: REMOTE_STREEM_SET,
        payload: { remoteStream: data },
    };
}

export function sendToBackend() {
    return () => Promise.resolve();
}