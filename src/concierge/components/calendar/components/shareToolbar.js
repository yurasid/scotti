import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Toolbar extends Component {
    static propTypes = {
        peer: PropTypes.shape({}).isRequired,
        label: PropTypes.string,
        onBackClick: PropTypes.func.isRequired,
        shareEvents: PropTypes.array
    }

    render() {
        const { label, onBackClick, shareEvents, peer } = this.props;
        return (
            <div className='rbc-toolbar'>
                <span
                    onClick={onBackClick}
                >
                    Back
                </span>
                <span className='rbc-toolbar-label'>
                    {label}
                </span>
                <span
                    onClick={() => {
                        if (!shareEvents.length) {
                            return false;
                        }

                        peer.sendEvents(shareEvents);
                    }}
                >
                    Share
                </span>
            </div>
        );
    }
}

function mapStateToProps(store) {
    return {
        shareEvents: store.calendar.shareEvents,
        peer: store.currentPeer.peer
    };
}

export default connect(mapStateToProps)(Toolbar);