import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setCurrentFile } from '../../redux/actions/peerConnection';
import { Button } from '../../../shared/components/';

import styles from './index.scss';

class File extends Component {
    constructor() {
        super();

        this.state = {
            show: false
        };
    }

    toggleFile = () => {
        const { show } = this.state;

        this.setState({
            show: !show
        }, () => {
            const { show } = this.state;
            const { currentPeer: { peer, file } } = this.props;

            peer.sendFile(show ? file : undefined);
        });
    }

    deinit = async () => {
        const {
            setCurrentFileDispatch,
            currentPeer: { peer }
        } = this.props;

        peer.sendFile(undefined);
        setCurrentFileDispatch(null);
    }

    componentWillUnmount() {
        this.deinit();
    }

    render() {
        const {
            currentPeer: { file }
        } = this.props;

        const { show } = this.state;

        return (
            <div className={styles.fileContainer}>
                <Button
                    icon={show ? 'showpass' : 'hidepass'}
                    color2={show ? '#75df00' : '#e16950'}
                    color1='transparent'
                    scale={2}
                    pressed={false}
                    allInside={true}
                    className={styles.button}
                    onClick={this.toggleFile}
                />
                <img src={file} />
                <span
                    className={styles.close}
                    onClick={this.deinit}
                />
            </div>
        );
    }
}

File.propTypes = {
    currentPeer: PropTypes.shape({
        peer: PropTypes.shape({}).isRequired,
        file: PropTypes.string
    }).isRequired,
    setCurrentFileDispatch: PropTypes.func.isRequired
};

File.defaultProps = {
    currentPeer: {
        file: ''
    }
};

function mapStoreToProps(store) {
    return {
        currentPeer: {
            peer: store.currentPeer.peer,
            file: store.currentPeer.file
        }
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setCurrentFileDispatch: setCurrentFile
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(File);