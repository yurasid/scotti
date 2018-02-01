import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import setCurrentPopup from '../../redux/actions/popup';

import styles from './index.scss';

const Popup = ({
    children,
    setCurrentPopupDispatch
}) => (
    <div className={children ? styles.popup : styles.hidden}>
        <span
            className={styles.close}
            onClick={() => setCurrentPopupDispatch(null)}
        />
        {children}
    </div>
);

Popup.propTypes = {
    children: PropTypes.element,
    setCurrentPopupDispatch: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setCurrentPopupDispatch: setCurrentPopup
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(Popup);