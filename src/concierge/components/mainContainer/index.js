import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';

import { MenuItem, Popup } from '../';
import TerminalsList from '../listOfTerminals/';

import styles from './index.scss';

const messages = defineMessages({
    storesLocation: {
        id: 'Dashboard.menu.storesLocation',
        defaultMessage: 'Stores Location'
    },
    promotion: {
        id: 'Dashboard.menu.promotions',
        defaultMessage: 'Promotions'
    },
    barsRestraunts: {
        id: 'Dashboard.menu.bars_restraunts',
        defaultMessage: 'Bars & Restaurants'
    },
    emergency: {
        id: 'Dashboard.menu.emergency',
        defaultMessage: 'Emergency'
    }
});

const menu = [
    { component: 'storesLocation', message: messages.storesLocation },
    { component: '', message: messages.promotion },
    { component: '', message: messages.barsRestraunts },
    { component: '', message: messages.emergency }
];

const components = {
    storesLocation: (<div>Testing</div>),
    terminalsList: TerminalsList
};

class MainContainer extends Component {
    constructor() {
        super();
    }

    render() {
        const {
            children,
            intl: { formatMessage },
            currentPopup
        } = this.props;

        const Component = currentPopup && components[currentPopup];

        return (
            <section className='mainContent center'>
                <nav>
                    {
                        menu.map(menuItem => {
                            return (
                                <MenuItem
                                    name={menuItem.component}
                                    key={menuItem.message.id}
                                    text={formatMessage(menuItem.message)}
                                />
                            );
                        })
                    }
                </nav>
                <div className={styles.container}>
                    <Popup
                        noStyles={currentPopup === 'terminalsList'}
                    >
                        {typeof Component === 'function' ? <Component /> : Component}
                    </Popup>
                    {children}
                </div>
            </section>
        );
    }
}

MainContainer.propTypes = {
    intl: PropTypes.shape({}).isRequired,
    children: PropTypes.element,
    currentPopup: PropTypes.string
};

function mapStoreToProps(store) {
    return {
        currentPopup: store.currentPopup
    };
}

export default connect(mapStoreToProps)(injectIntl(MainContainer));