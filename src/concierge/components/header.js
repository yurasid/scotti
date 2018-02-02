import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import UserInfo from './userInfo';
import { Icon } from '../../shared/components';

const Header = ({ handlerLogout }) => (
    <header>
        <div className='block block16 left userInfo'>
            <UserInfo />
        </div>
        <div className='block logo center'>
            <Icon name='logodef' />
        </div>
        <div className='block block16 right'>
            <div className='logout' onClick={handlerLogout}>
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
);

Header.propTypes = {
    handlerLogout: PropTypes.func.isRequired
};

export default Header;