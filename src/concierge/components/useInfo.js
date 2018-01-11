import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon } from '../../shared/components';

const UserInfo = ({
    currentUser: {
        name
    }
}) => (
    <Fragment>
        <div className='circle'>
            <Icon name='usericon' />
        </div>
        <span>User {name}</span>
    </Fragment>
);

UserInfo.propTypes = {
    currentUser: PropTypes.shape({
        name: PropTypes.string
    })
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    };
}

export default connect(mapStateToProps)(UserInfo);