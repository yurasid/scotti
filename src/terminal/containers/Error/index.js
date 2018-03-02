import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { Icon } from '../../../shared/components/';

import styles from './index.scss';

class ErrorContainer extends Component {
    constructor() {
        super();

        this.state = {
            height: 0,
            width: 0
        };
    }

    componentDidMount() {
        const {
            width: containerWidth,
            height: containerHeight
        } = this.container.getBoundingClientRect();

        const width = containerWidth;
        const height = containerHeight;

        this.setState({
            width,
            height
        });
    }

    render() {
        const { history } = this.props;
        const { height } = this.state;

        return (
            <div
                className={styles.container}
                onClick={() => history.push('/login')}
                ref={container => this.container = container}
            >
                <div className={styles.innerContainer}>
                    <div className={styles.textBlock}>
                        <FormattedMessage
                            id='Error.ooops'
                            defaultMessage='ooops!'
                        >
                            {(txt) => (
                                <span className={styles.mainSpan}>
                                    {txt}
                                </span>
                            )}
                        </FormattedMessage>
                        <FormattedMessage
                            id='Error.somethingWentWrong'
                            defaultMessage='Something went wrong'
                        >
                            {(txt) => (
                                <span className={styles.subSpan}>
                                    {txt}
                                </span>
                            )}
                        </FormattedMessage>
                        <Icon
                            name='bell'
                            className={styles.bell}
                            height={height * .07}
                            color='#009bf5'
                        />
                        <FormattedMessage
                            id='Error.touch'
                            defaultMessage='Touch the screen to start from beginning'
                        >
                            {(txt) => (
                                <span className={classNames({
                                    [styles.subSpan]: true,
                                    [styles.green]: true
                                })}>
                                    {txt}
                                </span>
                            )}
                        </FormattedMessage>
                    </div>
                    <Icon
                        name='logodef'
                        height={height * 0.07}
                        className={styles.logo}
                        color='#75df00'
                    />
                </div>
            </div>
        );
    }
}

ErrorContainer.propTypes = {
    history: PropTypes.shape({})
};

export default ErrorContainer;