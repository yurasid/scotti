import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

import { Ringing } from '../../../shared/components';
import { initEmitter } from '../../redux/actions/peerConnection';

import { fetchCurrentUser } from '../../redux/actions/user';

import styles from './index.scss';

class Start extends Component {

    init = async (props) => {
        const {
            initEmitterDispatch,
            currentPeer: {
                emitter,
                creating
            }
        } = props || this.props;

        if (!emitter) {
            return !creating && initEmitterDispatch('terminal');
        }
    }

    startCall = async () => {
        const { history, currentUserId, fetchCurrentUserDispatch } = this.props;

        if (!currentUserId) {
            await fetchCurrentUserDispatch();
        }

        history.push('/call');
    }

    componentWillMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps) {
        const { currentPeer: { emitter } } = nextProps;

        !emitter && this.init(nextProps);
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
    currentPeer: PropTypes.shape({
        emitter: PropTypes.shape({}),
        creating: PropTypes.bool
    }),
    currentUserId: PropTypes.number,
    initEmitterDispatch: PropTypes.func.isRequired,
    fetchCurrentUserDispatch: PropTypes.func.isRequired
};

function mapStoreToProps(store) {
    return {
        currentPeer: {
            emitter: store.currentPeer.emitter,
            creating: store.currentPeer.creating
        },
        currentUserId: store.currentUser.id
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        initEmitterDispatch: initEmitter,
        fetchCurrentUserDispatch: fetchCurrentUser
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(Start); 