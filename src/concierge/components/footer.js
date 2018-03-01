import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import CopyRight from './copyRight/';
import { Icon } from '../../shared/components';
import { MenuItem } from './';

const messages = defineMessages({
    terminalsList: {
        id: 'Dashboard.terminalsList',
        defaultMessage: 'Dashboard'
    }
});

const Footer = ({ intl: { formatMessage } }) => (
    <footer>
        <div className='block block16 left blue'>
            <MenuItem
                className='footerItem'
                icon='terminalslist'
                name='terminalsList'
                key={messages.terminalsList.id}
                text={formatMessage(messages.terminalsList)}
            />
        </div>
        <div className='block center'>
            <CopyRight color='#ebebeb' />
        </div>
        <div className='block block16 right blue tech-support'>
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
    </footer>
);

Footer.propTypes = {
    intl: PropTypes.shape({}).isRequired
};

export default injectIntl(Footer);