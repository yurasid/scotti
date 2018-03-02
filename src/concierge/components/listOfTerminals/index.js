import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchTerminals, updateTerminalStatus } from '../../redux/actions/terminals';

import Terminal from './terminal';

import styles from './index.scss';

class Terminals extends Component {
    updateHandler = ({ terminal_id }, status) => {
        const { updateTerminalStatusDispatch } = this.props;

        updateTerminalStatusDispatch({ id: terminal_id, status });
    }

    componentWillMount() {
        const { fetchTerminalsDispatch, emitter } = this.props;

        fetchTerminalsDispatch();

        this.events = {
            ['terminal_connected']: emitter.addListener('terminal_connected', this.updateHandler),
            ['terminal_disconnected']: emitter.addListener('terminal_disconnected', this.updateHandler)
        };
    }

    componentWillUnmount() {
        if (this.events) {
            Object.keys(this.events).map((eventKey) => {
                this.events[eventKey].remove();
                delete this.events[eventKey];
            });
        }
    }

    render() {
        const { terminals } = this.props;

        return (
            <div className={styles.container}>
                {
                    terminals.map(terminal => (
                        <div
                            className={styles.itemContainer}
                            key={terminal.id}
                        >
                            <Terminal key={terminal.id} terminal={terminal} />
                        </div>
                    ))
                }
            </div>
        );
    }
}

Terminals.propTypes = {
    fetchTerminalsDispatch: PropTypes.func.isRequired,
    updateTerminalStatusDispatch: PropTypes.func.isRequired,
    terminals: PropTypes.array,
    emitter: PropTypes.shape({})
};

Terminals.defaultProps = {
    terminals: []
};

function mapStateToProps(store) {
    return {
        terminals: store.terminals.all,
        emitter: store.currentPeer.emitter
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchTerminalsDispatch: fetchTerminals,
        updateTerminalStatusDispatch: updateTerminalStatus
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminals);