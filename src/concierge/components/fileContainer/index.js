import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

import { setCurrentFile, setCurrentFileError } from '../../redux/actions/peerConnection';
import { Button } from '../../../shared/components/';

import styles from './index.m.scss';

class File extends Component {
    static propTypes = {
        currentPeer: PropTypes.shape({
            peer: PropTypes.shape({}).isRequired,
            file: PropTypes.string,
            error: PropTypes.shape({})
        }).isRequired,
        setCurrentFileDispatch: PropTypes.func.isRequired,
        setCurrentFileErrorDispatch: PropTypes.func.isRequired
    }

    static defaultProps = {
        currentPeer: {
            file: '',
            error: null
        }
    }

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
            setCurrentFileErrorDispatch,
            currentPeer: { peer }
        } = this.props;

        peer.sendFile(undefined);
        setCurrentFileDispatch(null);
        setCurrentFileErrorDispatch(null);
    }

    componentWillUnmount() {
        this.deinit();
    }

    render() {
        const {
            currentPeer: { file, error }
        } = this.props;

        const { show } = this.state;

        return (
            <div className={styles.fileContainer}>
                {!error && <Button
                    icon={show ? 'showpass' : 'hidepass'}
                    color2={show ? '#75df00' : '#e16950'}
                    color1='transparent'
                    scale={2}
                    pressed={false}
                    allInside={true}
                    className={styles.button}
                    onClick={this.toggleFile}
                />}
                {error ?
                    <div className={styles.notImage}>
                        <FormattedMessage
                            id='FileContainer.notImage'
                            defaultMessage='Selected file is not an image'
                        />
                    </div> : <img src={file} />}
                <span
                    className={styles.close}
                    onClick={this.deinit}
                />
            </div>
        );
    }
}

function mapStoreToProps(store) {
    return {
        currentPeer: {
            peer: store.currentPeer.peer,
            file: store.currentPeer.file,
            error: store.currentPeer.fileError
        }
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setCurrentFileErrorDispatch: setCurrentFileError,
        setCurrentFileDispatch: setCurrentFile
    }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(File);