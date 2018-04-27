import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './index.m.scss';

class FilePreview extends Component {
    constructor(props) {
        super();

        const { file, showOnFile } = props;

        this.state = {
            imgUrl: file,
            visible: showOnFile
        };
    }

    sendMessageFileLoaded = () => {
        const { imgUrl } = this.state;
        const { peer } = this.props;

        peer && peer.sendDCMessage({
            type: 'fileReceived',
            visible: !!imgUrl
        });
    }

    init() {
        const { emitter } = this.props;

        if (emitter && !this.listeners) {

            let arrayOfChunks = [];

            this.listeners = {
                ['dc_file']: emitter.addListener('dc_file', ({ message, last }) => {
                    arrayOfChunks.push(message);

                    if (last) {
                        const received = arrayOfChunks.join('');
                        arrayOfChunks = [];

                        this.setState({
                            imgUrl: received
                        }, this.sendMessageFileLoaded);
                    }
                }),

                ['dc_fileReceived']: emitter.addListener('dc_fileReceived', ({ visible }) => {
                    this.setState({
                        visible
                    });
                })
            };
        }
    }

    componentDidMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps) {
        this.init();

        const { file } = nextProps;
        const { imgUrl } = this.state;

        if (file && file !== imgUrl) {
            this.setState({
                imgUrl: file
            });
        }
    }

    componentWillUnmount() {
        if (this.listeners) {
            Object.keys(this.listeners).map((eventKey) => {
                this.listeners[eventKey].remove();
                delete this.listeners[eventKey];
            });
        }
    }

    render() {
        const { className } = this.props;
        const { imgUrl, visible } = this.state;

        return imgUrl && visible ? (
            <div
                className={classNames({
                    [styles.picture]: true,
                    [className]: !!className
                })}>
                <img src={imgUrl} />
            </div>
        ) : <div style={{ display: 'none' }} />;
    }
}

FilePreview.propTypes = {
    className: PropTypes.string,
    emitter: PropTypes.shape({}),
    file: PropTypes.string,
    showOnFile: PropTypes.bool,
    peer: PropTypes.shape({})
};

FilePreview.defaultProps = {
    showOnFile: false
};

function mapStoreToProps(store) {
    return {
        emitter: store.currentPeer.emitter,
        file: store.currentPeer.file
    };
}

export default connect(mapStoreToProps, null)(FilePreview);