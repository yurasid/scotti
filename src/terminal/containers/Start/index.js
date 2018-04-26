import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

import { Ringing } from '../../../shared/components';

import { fetchCurrentUser } from '../../redux/actions/user';

import styles from './index.m.scss';

class Start extends Component {
    startCall = async () => {
        const { history, currentUserId, fetchCurrentUserDispatch } = this.props;

        if (!currentUserId) {
            try {
                await fetchCurrentUserDispatch();
            } catch (error) {
                this.setState({
                    error
                });
            }
        }

        history.push('/call');
    }

    componentWillReceiveProps() {
        const { error } = this.state || {};

        if (error) {
            throw error;
        }
    }

    render() {
        return (
            <div
                className={styles.container}
                onClick={this.startCall}
            >
                <Ringing
                    icon='bell'
                    iconActive='bellpressed'
                    color='#ffffff'
                    interval={10000}
                    withCircle={true}
                />

                <FormattedMessage
                    id='Main.call.touchToConnect'
                    defaultMessage='touch to connect'
                >
                    {(txt) => (
                        <span className={styles.touchSpan}>
                            {txt}
                        </span>
                    )}
                </FormattedMessage>

                <FormattedMessage
                    id='Main.call.inquiries'
                    defaultMessage='we are waiting for your inquiries'
                >
                    {(txt) => (
                        <span className={styles.startSpan}>
                            {txt}
                        </span>
                    )}
                </FormattedMessage>
            </div>
        );
    }
}

Start.propTypes = {
    history: PropTypes.shape({}).isRequired,
    currentUserId: PropTypes.number,
    fetchCurrentUserDispatch: PropTypes.func.isRequired
};

function mapStoreToProps(store) {
    return {
        currentUserId: store.currentUser.id
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchCurrentUserDispatch: fetchCurrentUser
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(Start); 