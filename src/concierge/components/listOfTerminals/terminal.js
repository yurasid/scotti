import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TerminalInfo } from '../';

import styles from './index.scss';

class Terminal extends Component {
    render() {
        const { terminal } = this.props;

        return (
            <div className={styles.item}>
                <div className={styles.terminalPicture}>
                    <img src={require('../../../shared/images/terminal.png')} />
                </div>
                <TerminalInfo withStatus={true} terminal={terminal} className={styles.terminalInfo} />
            </div>
        );
    }
}

Terminal.propTypes = {
    terminal: PropTypes.shape({}).isRequired
};

export default Terminal;