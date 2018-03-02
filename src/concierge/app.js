import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ConnectedRouter } from 'react-router-redux';
import { updateIntl, IntlProvider } from 'react-intl-redux';

import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';

import { store, history, setReducers } from '../shared/utils/store';
import reducers from './redux/reducers';

import Routes from './routes';

import {
    localRequest,
    generateHttpOptions
} from '../shared/utils/http';

require('./index.global.scss');

setReducers(reducers);

addLocaleData([...en, ...fr]);

const language = (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;

class RootComponent extends Component {
    getTranslations = async () => {
        const { updateIntlDispatch } = this.props;

        try {
            const { messages, locale } = await localRequest(`/translations/${language}`, generateHttpOptions({
                method: 'GET'
            }));

            return updateIntlDispatch({
                messages,
                locale
            });
        } catch (error) {
            return false;
        }
    }

    componentWillMount() {
        this.getTranslations();
    }

    render() {
        return (
            <IntlProvider>
                <ConnectedRouter history={history}>
                    <Routes />
                </ConnectedRouter>
            </IntlProvider>
        );
    }
}

RootComponent.propTypes = {
    updateIntlDispatch: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        updateIntlDispatch: updateIntl
    }, dispatch);
};

const Root = connect(null, mapDispatchToProps)(RootComponent);

ReactDOM.render(
    (<Provider store={store}>
        <Root />
    </Provider>),
    document.getElementById('root'),
);
