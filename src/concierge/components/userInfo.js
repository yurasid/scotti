import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Icon } from '../../shared/components';

const UserInfo = ({ currentUser: { username } }) => (
    <Fragment>
        <div className='circle'>
            <Icon name='usericon' />
        </div>
        <span>
            <FormattedMessage
                id='Dashboard.userInfo.userName'
                defaultMessage={`User {username}`}
                values={{ username }}
            />
        </span>
    </Fragment>
);

UserInfo.propTypes = {
    currentUser: PropTypes.shape({
        username: PropTypes.string
    })
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    };
}

export default connect(mapStateToProps)(UserInfo);