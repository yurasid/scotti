import { SET_REMOTE_STREAM, SET_LOCAL_STREAM } from '../actionTypes';

export function setLocalStream(data) {
    return {
        type: SET_LOCAL_STREAM,
        payload: { localStream: data },
    };
}

export function setRemoteStream(data) {
    return {
        type: SET_REMOTE_STREAM,
        payload: { remoteStream: data },
    };
}

export function sendToBackend() {
    return () => Promise.resolve();
}