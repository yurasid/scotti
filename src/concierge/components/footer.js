import React from 'react';
import { FormattedMessage } from 'react-intl';

import CopyRight from './copyRight/';
import { Icon } from '../../shared/components';

const Footer = () => (
    <footer>
        <div className='block block16 left blue' />
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

export default Footer;