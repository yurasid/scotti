import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { Icon } from '../../../../shared/components/';

import styles from './../index.m.scss';

class LoaderComponent extends Component {
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
        const { height } = this.state;

        return (
            <div
                className={styles.container}
                ref={container => this.container = container}
            >
                <div className={styles.textBlock}>
                    <FormattedMessage
                        id='GlobalError.sorry'
                        defaultMessage='Sorry!'
                    >
                        {(txt) => (
                            <span
                                className={classNames({
                                    [styles.mainSpan]: true,
                                    [styles.green]: true
                                })}>
                                {txt}
                            </span>
                        )}
                    </FormattedMessage>
                    <FormattedMessage
                        id='GlobalError.notAvailable'
                        defaultMessage='The service is not available at the moment'
                    >
                        {(txt) => (
                            <span className={styles.subSpan}>
                                {txt}
                            </span>
                        )}
                    </FormattedMessage>
                    <FormattedMessage
                        id='GlobalError.tryAgain'
                        defaultMessage='Please, try again in a few minutes'
                    >
                        {(txt) => (
                            <span className={styles.subSpan}>
                                {txt}
                            </span>
                        )}
                    </FormattedMessage>
                </div>
                <Icon
                    name='logodef'
                    height={height * .1}
                    color='#75df00'
                />
            </div>
        );
    }
}

export default LoaderComponent;