import { BACKEND_SOCKET_URL } from '../../../config/constants';

export default function initSockets(owner, cb) {
    const _cb = cb || (() => {});

    if (window.socket) {
        return _cb();
    }

    window.socket = new WebSocket(`${BACKEND_SOCKET_URL}?authorization=${window.sessionStorage.getItem('authToken')}&handler=${owner}`);
    window.socket.onopen = _cb;
    window.socket.onerror = _cb;
}
