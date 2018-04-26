import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import setCurrentPopup from '../../redux/actions/popup';

import styles from './index.m.scss';

const Popup = ({
    children,
    setCurrentPopupDispatch,
    noStyles
}) => (
    <div className={classNames({
        [styles.popup]: !!children,
        [styles.noStyles]: !!noStyles,
        [styles.hidden]: !children,

    })}>
        {!noStyles && <span
            className={styles.close}
            onClick={() => setCurrentPopupDispatch(null)}
        />}
        {children}
    </div>
);

Popup.propTypes = {
    children: PropTypes.element,
    noStyles: PropTypes.bool,
    setCurrentPopupDispatch: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setCurrentPopupDispatch: setCurrentPopup
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(Popup);