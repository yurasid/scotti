import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';

import { fetchCurrentUser, currentUserLoadingStatus } from '../../redux/actions/user';
import { logout } from '../../redux/actions/auth';
import { setCurrentPeer, setRemoteStream } from '../../redux/actions/peerConnection';

import PeerConnection from '../../../shared/utils/peerConnection';
import initSockets from '../../../shared/utils/webSockets';

import { Footer, Header, MainContainer, Video, LeftAside } from '../../components/';

import './index.global.scss';



class Home extends Component {
    constructor() {
        super();

        this.state = {
            offer: null
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
                await fetchCurrentUserDispatch();
            } catch (error) {
                currentUserLoadingStatusDispatch();
                history.push('/login');
            }
        }
    }

    gotOffer = (msg) => {
        this.setState({
            offer: msg
        });
    }

    componentWillMount() {
        const { setCurrentPeerDispatch, setRemoteStreamDispatch } = this.props;


        const peerConnection = new PeerConnection(setRemoteStreamDispatch);

        initSockets('concierge', (err) => {
            if (err) {
                return alert('no sockets');
            }

            peerConnection.subscribeOnSockets(this.gotOffer);
        });

        setCurrentPeerDispatch(peerConnection);
        this.checkCurrentUser();
    }

    render() {
        const { offer } = this.state;

        return (
            <Fragment>
                <Header handlerLogout={this.handlerLogout}/>
                <main>
                    <LeftAside />
                    <MainContainer>
                        {offer && <Video offer={offer} />}
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
    history: PropTypes.shape({}).isRequired,
    intl: PropTypes.shape({}).isRequired,
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        loading: PropTypes.bool,
    }).isRequired,
    logoutDispatch: PropTypes.func.isRequired,
    setCurrentPeerDispatch: PropTypes.func.isRequired,
    setRemoteStreamDispatch: PropTypes.func.isRequired,
    fetchCurrentUserDispatch: PropTypes.func.isRequired,
    currentUserLoadingStatusDispatch: PropTypes.func.isRequired
};

function mapStoreToProps(store) {
    return {
        currentUser: store.currentUser
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setCurrentPeerDispatch: setCurrentPeer,
        setRemoteStreamDispatch: setRemoteStream,
        logoutDispatch: logout,
        fetchCurrentUserDispatch: fetchCurrentUser,
        currentUserLoadingStatusDispatch: currentUserLoadingStatus
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(injectIntl(Home));
