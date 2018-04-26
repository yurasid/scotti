import { EventEmitter } from 'fbemitter';
import { debounce } from 'lodash';
import { BACKEND_SOCKET_URL } from '../../../config/constants';
import { handleHttpError } from './http';

class Emitter extends EventEmitter {
    constructor(owner) {
        super();

        this.owner = owner;

        const simpleInit = async () => {
            try {
                this.initWS();
                this.reinitTimeout && clearTimeout(this.reinitTimeout);
            } catch (error) {
                console.log(error); // eslint-disable-line
                return false;
            }
    
            return this;
        };

        const initDebounce = debounce(simpleInit, 5000);

        this.init = (timeout) => {
            return timeout ? initDebounce() : simpleInit();
        };
    }

    initWS = async () => {
        if (this.ws) {
            this.ws.onclose = () => { };
        }

        try {
            this.ws = await new Promise((resolve, reject) => {
                const socket = new WebSocket(`${BACKEND_SOCKET_URL}?authorization=${window.sessionStorage.getItem('authToken')}&handler=${this.owner}`);

                socket.onopen = () => resolve(socket);
                socket.onerror = (error) => {
                    console.log('error', error); // eslint-disable-line
                    reject(error);
                };

                socket.onclose = (error) => {
                    console.error('here', error); // eslint-disable-line
                    // this.reInitWS(true);
                };
            });
        } catch (error) {
            throw error;
        }

        this.ws.onmessage = async (message) => {
            const msg = JSON.parse(message.data || message);

            switch (msg.type) {
                case 'busy':
                case 'ready_call':
                case 'concierge_offline':
                case 'unauthenticated':
                    this.emit(msg.type);
                    break;
                case 'offer':
                case 'answer':
                case 'candidate':
                case 'call_started':
                case 'want_call':
                case 'toggle_stream':
                case 'terminal_disconnected':
                case 'hang_up':
                    this.emit(msg.type, msg);
                    break;
                case 'terminal_connected':
                    this.emit(msg.type, msg, true);
                    break;
                case 'authenticated':
                    this.turn_credentials = msg.turn_credentials;
                    this.emit('authenticated');
                    break;
                default:
                    break;
            }
        };
    }

    reInitWS = async (timeout) => {
        const unauthenticatedError = new Error();
        unauthenticatedError.code = 401;

        try {
            await handleHttpError(unauthenticatedError, `/api/${this.owner}/refresh`);
            return this.init(timeout);
        } catch (error) {
            throw error;
        }
    }

    sendMessage = (messageJSON = {}) => {
        const sockets = this.ws;

        sockets && sockets.send(JSON.stringify(messageJSON));
    }

    close = () => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
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
