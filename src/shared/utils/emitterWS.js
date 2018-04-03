import { EventEmitter } from 'fbemitter';
import { BACKEND_SOCKET_URL } from '../../../config/constants';
import { handleHttpError, localRequest, generateHttpOptions } from './http';

class Emitter extends EventEmitter {
    constructor(owner) {
        super();

        this.owner = owner;
    }

    initWS = async () => {
        try {
            this.ws = await new Promise((resolve, reject) => {
                const socket = new WebSocket(`${BACKEND_SOCKET_URL}?authorization=${window.sessionStorage.getItem('authToken')}&handler=${this.owner}`);

                socket.onopen = () => resolve(socket);
                socket.onerror = (error) => {
                    console.log(error); // eslint-disable-line
                    reject(error);
                };

                socket.onclose = (error) => {
                    console.error(error); // eslint-disable-line
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
                case 'authenticated':
                    this.turn_credentials = msg.turn_credentials;
                    this.emit('authenticated');
                    break;
                default:
                    break;
            }
        };
    }

    init = async () => {
        try {
            this.initWS();
            this.reinitTimeout && clearTimeout(this.reinitTimeout);
        } catch (error) {
            console.log(error); // eslint-disable-line
            return false;
        }

        return this;
    }

    closeWS = () => {
        if (this.ws) {
            const ws = this.ws;
            const onClose = function () {
                ws.onclose = null;
            };

            // this.sendMessage({ type: 'close_me' });

            if (ws.readyState === WebSocket.CLOSED) {
                onClose();
            } else {
                try {
                    ws.onclose = onClose;
                    ws.close();
                } catch (err) {
                    onClose();
                }
            }

            ws.onopen = null;
            ws.onmessage = null;
            ws.onerror = function () { };

            this.ws = null;
        }

        const closeWS = async (dispatch) => {
            try {
                await localRequest(`/api/${this.owner}/close-ws`, generateHttpOptions({
                    method: 'POST',
                }));

            } catch (error) {
                await handleHttpError(error, `/api/${this.owner}/refresh`);

                await closeWS(dispatch);
            }
        };
    }

    reInitWS = async (timeout) => {
        const unauthenticatedError = new Error();
        unauthenticatedError.code = 401;

        this.closeWS();

        if (timeout) {
            this.reinitTimeout && clearTimeout(this.reinitTimeout);
            return this.reinitTimeout = setTimeout(this.init, 5000);
        }

        try {
            await handleHttpError(unauthenticatedError, `/api/${this.owner}/refresh`);
            return this.init();
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
