import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

class Aside extends Component {
    componentDidUpdate() {
        const { localStream } = this.props;

        localStream && this.video && (this.video.srcObject = localStream);
    }

    render() {
        const { localStream } = this.props;

        return (
            <aside className='block16 left blue'>
                {localStream && <video
                    autoPlay
                    muted
                    ref={video => this.video = video}
                />}
            </aside>
        );
    }
}

Aside.propTypes = {
    localStream: PropTypes.shape({})
};

function mapStoreToProps(store) {
    return {
        localStream: store.currentPeer.localStream,
    };
}

export default connect(mapStoreToProps, null)(Aside);