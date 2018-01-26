import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

import { fetchCurrentUser, currentUserLoadingStatus } from '../../redux/actions/user';
import { logout } from '../../redux/actions/auth';

import { Icon } from '../../../shared/components';
import CopyRight from '../../components/copyRight/';
import UserInfo from '../../components/useInfo';
import MenuItem from '../../components/menuItem';

import './index.global.scss';

const messages = defineMessages({
    menu1: {
        id: 'Dashboard.menu.storesLocation',
        defaultMessage: 'Stores Location'
    },
    menu2: {
        id: 'Dashboard.menu.promotions',
        defaultMessage: 'Promotions'
    },
    menu3: {
        id: 'Dashboard.menu.bars_restraunts',
        defaultMessage: 'Bars & Restaurants'
    },
    menu4: {
        id: 'Dashboard.menu.emergency',
        defaultMessage: 'Emergency'
    }
});
class Home extends Component {
    handlerLogout = async () => {
        const { history, logoutDispatch } = this.props;

        await logoutDispatch();

        history.push('/');
    }

    checkCurrentUser = async() => {
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

    componentWillMount() {
        this.checkCurrentUser();
    }

    render() {
        const { intl: { formatMessage } } = this.props;

        return (
            <Fragment>
                <header>
                    <div className='block block16 left userInfo'>
                        <UserInfo />
                    </div>
                    <div className='block logo center'>
                        <Icon name='logodef' />
                    </div>
                    <div className='block block16 right'>
                        <div className='logout' onClick={this.handlerLogout}>
                            <span>
                                <FormattedMessage
                                    id='Dashboard.logout'
                                    defaultMessage='Logout'
                                />
                            </span>
                            <Icon name='logout' />
                        </div>
                    </div>
                </header>
                <main>
                    <aside className='block16 left blue'>Left</aside>
                    <section className='mainContent center'>
                        <nav>
                            <MenuItem text={formatMessage(messages.menu1)} />
                            <MenuItem text={formatMessage(messages.menu2)} />
                            <MenuItem text={formatMessage(messages.menu3)} />
                            <MenuItem text={formatMessage(messages.menu4)} />
                        </nav>
                        <div>Video call component</div>
                    </section>
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
                <footer>
                    <div className='block block16 left blue tech-support'>
                        <Icon name='tech' />
                        <div>
                            <span>
                                <FormattedMessage
                                    id='Dashboard.techSupport'
                                    defaultMessage='Tech Support'
                                />
                            </span>
                            <span>818-402-0605</span>
                        </div>
                    </div>
                    <div className='block center'>
                        <CopyRight color='#ebebeb' />
                    </div>
                    <div className='block block16 right blue' />
                </footer>
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
        logoutDispatch: logout,
        fetchCurrentUserDispatch: fetchCurrentUser,
        currentUserLoadingStatusDispatch: currentUserLoadingStatus
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(injectIntl(Home));
