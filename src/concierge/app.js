import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from 'react-intl';

import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';

// import { BACKEND_SOCKET_URL } from '../../config/constants';

import Routes from './routes';

import {
    localRequest,
    generateHttpOptions
} from '../shared/utils/http';

require('./index.global.scss');

addLocaleData([...en, ...fr]);

const language = (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;

class Root extends Component {
    constructor() {
        super();
        this.state = {
            messages: null,
            locale: 'en'
        };
    }

    getTranslations = async () => {
        try {
            const { messages, locale } = await localRequest(`/translations/${language}`, generateHttpOptions({
                method: 'GET'
            }));

            return this.setState({
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
        const { messages, locale } = this.state;

        /* <IntlProvider key={locale}> to force a full teardown until the underlying React context issue is resolved. */

        return (
            <IntlProvider key={locale} locale={locale} messages={messages}>
                <Routes />
            </IntlProvider>
        );
    }
}


ReactDOM.render(
    <Root />,
    document.getElementById('root'),
);
