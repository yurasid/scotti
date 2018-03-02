import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { rateCall } from '../../redux/actions/peerConnection';

import { Button } from '../../../shared/components';

import styles from './index.scss';

import Question from './components/Question';
import Exit from './components/ThankExit';
import Stars from './components/Stars';
import Thank from './components/Thank';

class Rate extends Component {
    constructor(props) {
        super();

        const { location: { state } } = props;
        const { step } = state || {};

        this.state = {
            step: step || 0
        };

        this.stepsSequence = [
            'question',
            'stars',
            'thank'
        ];

        this.Components = {
            stars: Stars,
            question: Question,
            exit: Exit,
            thank: Thank
        };
    }

    stepClick = (value) => {
        const {
            rateCallDispatch,
            location: { state }
        } = this.props;
        const { step } = this.state;
        let newStep = -1;
        const callId = state && state.call_id;

        switch (this.stepsSequence[step]) {
            case 'question':
                if (value) {
                    newStep = step + 1;
                }
                break;
            case 'stars':
                if (typeof value === 'number') {
                    newStep = step + 1;
                    (typeof callId !== 'undefined') && rateCallDispatch(callId, value);
                }
                break;
            default:
                break;
        }

        this.setState({
            step: newStep
        });
    }

    initTimeout = () => {
        this.timeout && clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.exit(), 20000);
    }

    exit = () => {
        const { history } = this.props;
        history.push('/');
    }

    componentDidMount() {
        this.initTimeout();
    }

    componentDidUpdate() {
        this.initTimeout();
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
    }

    render() {
        const { step } = this.state;

        const InnerElementName = this.stepsSequence[step];
        const InnerComponent = InnerElementName && this.Components[InnerElementName];
        const InnerContent = InnerComponent ?
            <InnerComponent onClick={this.stepClick} /> :
            <Exit />;

        const containerProps = {
            className: styles.container
        };

        if (!InnerComponent || step === this.stepsSequence.length - 1) {
            containerProps.onClick = this.exit;
        }

        return (
            <div {...containerProps}>
                <div className={styles.innerContainer}>
                    {InnerContent}
                </div>

                <div className={styles.logout}>
                    <Button
                        icon='logout'
                        color2='#0481C8'
                        className={styles.button}
                        onClick={this.exit}
                    />
                </div>
            </div>
        );
    }
}

Rate.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({})
    }).isRequired,
    history: PropTypes.shape({}).isRequired,
    rateCallDispatch: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        rateCallDispatch: rateCall
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(Rate);