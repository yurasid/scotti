import {
    localRequest,
    generateHttpOptions,
    handleHttpError
} from '../../../shared/utils/http';

const uri = '/api/terminal';

export * from '../../../shared/redux/actions/peerConnection';

export function sendToBackend() {
    return () => Promise.resolve();
}

export function rateCall(id, rate_value) {
    const rateCallDispatch = async (dispatch) => {
        try {
            return await localRequest(`${uri}/rate/call-session/${id}`, generateHttpOptions({
                method: 'POST',
                body: JSON.stringify({ rate_value }),
            }));
        } catch (error) {
            await handleHttpError(error, `${uri}/refresh`);

            await rateCallDispatch(dispatch);
        }
    };

    return rateCallDispatch;
}