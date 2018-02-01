import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';

import { MenuItem, Popup } from '../';
import setCurrentPopup from '../../redux/actions/popup';

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

const menu = [
    { component: 'menu1', message: messages.menu1 },
    { component: '', message: messages.menu2 },
    { component: '', message: messages.menu3 },
    { component: '', message: messages.menu4 }
];

const components = {
    menu1: (<div>Testing</div>)
};

class MainContainer extends Component {
    constructor() {
        super();
    }

    render() {
        const { 
            children,
            currentPopup, 
            setCurrentPopupDispatch,
            intl: { formatMessage } 
        } = this.props;

        const Component = currentPopup && components[currentPopup];

        return (
            <section className='mainContent center'>
                <nav>
                    {
                        menu.map(menuItem => {
                            return (
                                <MenuItem
                                    active={menuItem.component === currentPopup}
                                    key={menuItem.message.id}
                                    text={formatMessage(menuItem.message)}
                                    onClick={() => setCurrentPopupDispatch(menuItem.component)}
                                />
                            );
                        })
                    }
                </nav>
                <div>
                    <Popup>
                        {Component}
                    </Popup>
                    {children}
                </div>
            </section>
        );
    }
}

MainContainer.propTypes = {
    intl: PropTypes.shape({}).isRequired,
    setCurrentPopupDispatch: PropTypes.func.isRequired,
    currentPopup: PropTypes.string,
    children: PropTypes.element
};

function mapStoreToProps(store) {
    return {
        currentPopup: store.currentPopup
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setCurrentPopupDispatch: setCurrentPopup
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(injectIntl(MainContainer));