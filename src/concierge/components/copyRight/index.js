import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../../shared/components/';

import styles from './index.scss';

const CopyRight = ({
    height,
    color
}) => {
    const iconProps = { color };
    const firstSpanStyle = { color };
    const secondSpanStyle = { color };

    if (!isNaN(+height)) {
        iconProps.height = height * 0.55;
        firstSpanStyle.fontSize = height * 1.4;
        secondSpanStyle.fontSize = height * 0.7;
    }

    return (
        <div className={styles.copyRight}>
            <Icon name='scottilogo' {...iconProps} className={styles.firstSpan}/>
            <span className={styles.secondSpan} style={firstSpanStyle}>©</span>
            <span className={styles.thirdSpan} style={secondSpanStyle}>2018</span>
        </div>
    );
};

CopyRight.propTypes = {
    height: PropTypes.number,
    color: PropTypes.string
};

CopyRight.defaultProps = {
    height: 26,
    color: '#ffffff'
};

export default CopyRight;