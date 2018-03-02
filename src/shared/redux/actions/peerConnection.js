import {
    CURRENT_EMITTER_SET,
    CURRENT_EMITTER_ERROR,
    CURRENT_EMITTER_CREATING,
    CURRENT_PEER_SET
} from '../actionTypes';

import Emitter from '../../utils/emitterWS';

export function setCurrentPeer(payload) {
    return {
        type: CURRENT_PEER_SET,
        payload
    };
}

export function initEmitter(owner) {
    return async (dispatch) => {
        dispatch(setCurrentEmitterLoading());
        try {
            const emmiter = await new Emitter(owner).init();

            dispatch(setCurrentEmitter(emmiter));
        } catch (error) {
            dispatch(setCurrentEmitterError(error));
        }
    };
}

export function setCurrentEmitterLoading() {
    return {
        type: CURRENT_EMITTER_CREATING
    };
}

export function setCurrentEmitterError(payload) {
    return {
        type: CURRENT_EMITTER_ERROR,
        payload
    };
}

export function setCurrentEmitter(payload) {
    return {
        type: CURRENT_EMITTER_SET,
        payload
    };
}