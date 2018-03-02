import { EventEmitter } from 'fbemitter';
import { BACKEND_SOCKET_URL } from '../../../config/constants';

class Emitter extends EventEmitter {
    constructor(owner) {
        super();

        this.owner = owner;
    }

    initWS = async () => {
        if (this.ws) {
            this.ws.onclose = function () { };
            this.ws.close();
        }

        try {
            this.ws = await new Promise((resolve, reject) => {
                const socket = new WebSocket(`${BACKEND_SOCKET_URL}?authorization=${window.sessionStorage.getItem('authToken')}&handler=${this.owner}`);

                socket.onopen = () => resolve(socket);
                socket.onerror = reject;
            });
        } catch (error) {
            throw error;
        }

        this.ws.onmessage = async (message) => {
            const msg = JSON.parse(message.data || message);

            switch (msg.type) {
                case 'busy':
                case 'ready_call':
                case 'hang_up':
                case 'concierge_offline':
                    this.emit(msg.type);
                    break;
                case 'offer':
                case 'answer':
                case 'candidate':
                case 'call_started':
                case 'want_call':
                case 'toggle_stream':
                case 'terminal_disconnected':
                    this.emit(msg.type, msg);
                    break;
                case 'terminal_connected':
                    this.emit(msg.type, msg, true);
                    break;
                case 'unauthenticated':
                    this.emit('unauthenticated');
                    break;
                default:
                    break;
            }
        };
    }

    init = async function () {
        this.initWS();

        return this;
    }

    sendMessage = (messageJSON = {}) => {
        const sockets = this.ws;

        sockets && sockets.send(JSON.stringify(messageJSON));
    }

    close = () => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.onclose = function () { };
            this.ws.close();
        }

        return true;
    }
}

export default Emitter;

export async function initEventEmitter(owner, successHandler, errorHandler) {
    try {
        const emmiter = await new Emitter(owner).init();

        (successHandler && successHandler(emmiter)) || emmiter;
    } catch (error) {
        if (!errorHandler) {
            throw error;
        }
        errorHandler(error);
    }
}
