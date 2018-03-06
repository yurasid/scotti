import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';

import { fetchCurrentUser, currentUserLoadingStatus } from '../../redux/actions/user';
import { logout } from '../../redux/actions/auth';
import { setCurrentPeer, setRemoteStream, initEmitter, setCurrentEmitter } from '../../redux/actions/peerConnection';

import PeerConnection from '../../../shared/utils/peerConnection';
import { handleHttpError } from '../../../shared/utils/http';
import { fetchCurrentTerminal } from '../../redux/actions/terminals';

import { Footer, Header, MainContainer, Video, LeftAside } from '../../components/';
import setCurrentPopup from '../../redux/actions/popup';

import './index.global.scss';

class Home extends Component {
    constructor() {
        super();

        this.state = {
            showIncomingCall: false
        };
    }

    handlerLogout = async () => {
        const { history, logoutDispatch } = this.props;

        await logoutDispatch();

        history.push('/');
    }

    checkCurrentUser = async () => {
        const {
            currentUser,
            fetchCurrentUserDispatch,
            currentUserLoadingStatusDispatch,
            history
        } = this.props;

        if (!currentUser || (!currentUser.id && !currentUser.loading)) {
            try {
                currentUserLoadingStatusDispatch(true);
                return await fetchCurrentUserDispatch();
            } catch (error) {
                currentUserLoadingStatusDispatch();
                history.push('/login');
            }
        }
    }

    wantCallHandler = async (msg) => {
        const { fetchCurrentTerminalDispatch, setCurrentPopupDispatch } = this.props;
        const { terminal_id } = msg;

        try {
            await fetchCurrentTerminalDispatch(terminal_id);

            this.setState({
                showIncomingCall: true
            }, () => setCurrentPopupDispatch(null));
        } catch (error) {
            console.log(error); // eslint-disable-line
        }
    }

    deinit = () => {
        const {
            setCurrentPeerDispatch,
            currentPeer: { peer }
        } = this.props;

        if (this.events) {
            Object.keys(this.events).map((eventKey) => {
                this.events[eventKey].remove();
                delete this.events[eventKey];
            });
        }


        peer && peer.close();

        setCurrentPeerDispatch(null);
    }

    reinitSockets = async () => {
        const { currentPeer: { emitter } } = this.props;
        const unauthenticatedError = new Error();
        unauthenticatedError.code = 401;

        try {
            await handleHttpError(unauthenticatedError, '/api/concierge/refresh');
            return emitter.initWS();
        } catch (error) {
            return console.error(error); // eslint-disable-line
        }
    }

    init = async (props) => {
        const {
            currentPeer: {
                emitter,
                remoteStream
            },
            setCurrentPeerDispatch,
            setRemoteStreamDispatch,
            initEmitterDispatch
        } = props || this.props;

        if (!emitter) {
            return initEmitterDispatch('concierge');
        }

        this.events = {
            ['want_call']: emitter.addListener('want_call', this.wantCallHandler),
            ['remote_stream']: emitter.addListener('remote_stream', (stream) => {
                if (remoteStream !== stream) {
                    setRemoteStreamDispatch(stream);
                }
            }),
            ['unauthenticated']: emitter.addListener('unauthenticated', this.reinitSockets)
        };

        const peerConnection = new PeerConnection(emitter);

        setCurrentPeerDispatch(peerConnection);
    }

    componentWillMount() {
        this.checkCurrentUser()
            .then(() => {
                const { currentPeer: { peer, creating }, currentUser: { id } } = this.props;

                !creating && !peer && id && this.init();
            });
    }

    componentWillReceiveProps(nextProps) {
        const { currentPeer: { peer, creating }, currentUser: { id } } = nextProps;

        !creating && !peer && id && this.init(nextProps);
    }

    componentWillUnmount() {
        this.deinit();

        const {
            setCurrentEmitterDispatch,
            currentPeer: { emitter }
        } = this.props;

        emitter && emitter.close() && setCurrentEmitterDispatch(null);
    }

    render() {
        const { showIncomingCall } = this.state;

        return (
            <Fragment>
                <Header handlerLogout={this.handlerLogout} />
                <main>
                    <LeftAside />
                    <MainContainer>
                        {showIncomingCall ? <Video /> : <Fragment />}
                    </MainContainer>
                    <aside className='block16 right blue'>
                        <h2>
                            <FormattedMessage
                                id='Dashboard.userLinks'
                                defaultMessage='User links'
                            />
                        </h2>
                        <ul className='usableLinks'>
                            <li>
                                <a
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    href='https://www.google.com'
                                >
                                    www.usable.link.info
                                </a>
                            </li>
                        </ul>
                    </aside>
                </main>
                <Footer />
            </Fragment>
        );
    }
}

Home.propTypes = {
    intl: PropTypes.shape({}).isRequired,
    currentPeer: PropTypes.shape({
        peer: PropTypes.shape({}),
        emitter: PropTypes.shape({}),
        creating: PropTypes.bool,
        remoteStream: PropTypes.shape({})
    }),
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        loading: PropTypes.bool,
    }).isRequired,
    logoutDispatch: PropTypes.func.isRequired,
    initEmitterDispatch: PropTypes.func.isRequired,
    setCurrentEmitterDispatch: PropTypes.func.isRequired,
    setCurrentPeerDispatch: PropTypes.func.isRequired,
    setRemoteStreamDispatch: PropTypes.func.isRequired,
    fetchCurrentUserDispatch: PropTypes.func.isRequired,
    fetchCurrentTerminalDispatch: PropTypes.func.isRequired,
    currentUserLoadingStatusDispatch: PropTypes.func.isRequired,
    setCurrentPopupDispatch: PropTypes.func.isRequired
};

function mapStoreToProps(store) {
    return {
        currentUser: store.currentUser,
        currentPeer: {
            peer: store.currentPeer.peer,
            emitter: store.currentPeer.emitter,
            creating: store.currentPeer.creating,
            remoteStream: store.currentPeer.remoteStream,
        }
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setCurrentPeerDispatch: setCurrentPeer,
        initEmitterDispatch: initEmitter,
        setCurrentEmitterDispatch: setCurrentEmitter,
        setRemoteStreamDispatch: setRemoteStream,
        fetchCurrentTerminalDispatch: fetchCurrentTerminal,
        logoutDispatch: logout,
        fetchCurrentUserDispatch: fetchCurrentUser,
        currentUserLoadingStatusDispatch: currentUserLoadingStatus,
        setCurrentPopupDispatch: setCurrentPopup
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(injectIntl(Home));
