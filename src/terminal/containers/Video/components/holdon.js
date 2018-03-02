import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { Icon } from '../../../../shared/components/';

import styles from './../index.scss';

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
                className={styles.holdOnContainer}
                ref={container => this.container = container}
            >
                <div className={styles.textBlock}>
                    <FormattedMessage
                        id='Video.holdOn'
                        defaultMessage='Hold on please'
                    >
                        {(txt) => (
                            <span
                                className={classNames({
                                    [styles.mainSpan]: true
                                })}>
                                {txt}
                            </span>
                        )}
                    </FormattedMessage>
                    <FormattedMessage
                        id='Video.holdOnConnect'
                        defaultMessage='Your will be connected in a few moments'
                    >
                        {(txt) => (
                            <span className={styles.subSpan}>
                                {txt}
                            </span>
                        )}
                    </FormattedMessage>
                    <Icon name='logoconnecting' height={height * 0.3} />
                </div>
            </div>
        );
    }
}

export default LoaderComponent;