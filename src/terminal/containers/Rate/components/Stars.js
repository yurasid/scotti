import React, { Fragment, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Rating from 'react-rating';

import { Icon } from '../../../../shared/components/';

import styles from '../index.m.scss';

class Stars extends Component {
    constructor() {
        super();

        this.state = {
            height: 0,
            width: 0
        };

        this.timeoutTime = 700;
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

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
    }

    starClick = (value) => {
        const { onClick } = this.props;

        this.timeout = setTimeout(() => onClick(value), this.timeoutTime);
    }

    render() {
        const {
            height,
            width,
        } = this.state;

        const minMeasure = height < width ? height : width;
        const starProps = {
            color: '#f5a623'
        };

        if (minMeasure) {
            starProps.height = minMeasure * .4;
        }

        const emptyStar = <Icon name='starempty' {...starProps} />;

        const fullStar = <Icon name='starfull' {...starProps} />;

        return (
            <Fragment>
                <FormattedMessage
                    id='Main.afterCall.rate'
                    defaultMessage='Please rate Your concierge'
                >
                    {(txt) => (
                        <span className={styles.mainSpan}>{txt}</span>
                    )}
                </FormattedMessage>
                <div
                    className={classNames({
                        [styles.buttonsContainer]: true,
                        [styles.stars]: true
                    })}
                    ref={container => this.container = container}
                >
                    <Icon
                        name='finger'
                        height={minMeasure * .2}
                        className={styles.down}
                        color='#45b5f2'
                    />
                    <Rating
                        onChange={this.starClick}
                        emptySymbol={emptyStar}
                        fullSymbol={fullStar}
                    />
                    <Icon
                        name='finger'
                        height={minMeasure * .2}
                        className={styles.up}
                        color='#45b5f2'
                    />
                </div>
            </Fragment>
        );
    }
}

Stars.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default Stars;