import {
    LOCAL_STREEM_SET,
    REMOTE_STREEM_SET,
    CURRENT_FILE_SET,
    CURRENT_FILE_SET_ERROR
} from '../actionTypes';

export * from '../../../shared/redux/actions/peerConnection';

export function setLocalStream(data) {
    return {
        type: LOCAL_STREEM_SET,
        payload: { localStream: data },
    };
}

export function setCurrentFile(data) {
    return {
        type: CURRENT_FILE_SET,
        payload: { file: data },
    };
}

export function setCurrentFileError(data) {
    return {
        type: CURRENT_FILE_SET_ERROR,
        payload: { fileError: data },
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