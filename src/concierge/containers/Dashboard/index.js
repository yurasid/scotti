import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon } from '../../../shared/components';
import CopyRight from '../../components/copyRight/';
import UserInfo from '../../components/useInfo';
import MenuItem from '../../components/menuItem';

import './index.global.scss';
import { history } from '../../utils/store';

class Home extends Component {
    handlerLogout() {
        window.sessionStorage.removeItem('authToken');
        history.push('/');
    }
    componentWillMount () {
        this.handlerLogout = ::this.handlerLogout;
    }
    render() {
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
                            <span>Logout</span>
                            <Icon name='logout' />
                        </div>
                    </div>
                </header>
                <main>
                    <aside className='block16 left blue'>Left</aside>
                    <section className='mainContent center'>
                        <nav>
                            <MenuItem text='stores location' />
                            <MenuItem text='promotions' />
                            <MenuItem text='bars & restaurants' />
                            <MenuItem text='emergency' />
                        </nav>
                        <div>Video call component</div>
                    </section>
                    <aside className='block16 right blue'>
                        <h2>User links</h2>
                        <ul className='usableLinks'>
                            <li><a target="_blank" href='https://www.google.com'>www.usable.link.info</a></li>
                        </ul>
                    </aside>
                </main>
                <footer>
                    <div className='block block16 left blue tech-support'>
                        <Icon name='tech' />
                        <div>
                            <span>tech support</span>
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
    history: PropTypes.shape({}).isRequired
};


export default connect()(Home);
