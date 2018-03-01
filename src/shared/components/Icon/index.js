import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import username from '../../images/icons/user-name-icon.svg';
import password from '../../images/icons/password-icon.svg';
import showpass from '../../images/icons/icon-show-password.svg';
import hidepass from '../../images/icons/icon-hide-password.svg';
import logorings from '../../images/icons/logo-rings.svg';
import logodef from '../../images/icons/logo-def.svg';
import logoconnecting from '../../images/icons/logo-connecting.svg';
import logout from '../../images/icons/logout-icon.svg';
import tech from '../../images/icons/tech-support.svg';
import usericon from '../../images/icons/icon-user.svg';
import scottilogo from '../../images/icons/scotti.svg';
import bellpressed from '../../images/icons/concierge-bell-pressed.svg';
import bell from '../../images/icons/concierge-bell.svg';
import conciergepause from '../../images/icons/concierge-pause.svg';
import hidevideo from '../../images/icons/hide-video.svg';
import showvideo from '../../images/icons/show-video.svg';
import hangup from '../../images/icons/hang-up.svg';
import yesbtnactive from '../../images/icons/yesbtn-active.svg';
import starempty from '../../images/icons/star-empty.svg';
import starfull from '../../images/icons/star-full.svg';
import finger from '../../images/icons/finger.svg';
import shareimage from '../../images/icons/share-image.svg';
import terminalslist from '../../images/icons/terminals-list.svg';

import styles from './index.scss';

const icons = {
    username,
    password,
    showpass,
    hidepass,
    logodef,
    logorings,
    logoconnecting,
    logout,
    tech,
    usericon,
    scottilogo,
    bellpressed,
    bell,
    hidevideo,
    showvideo,
    hangup,
    conciergepause,
    yesbtnactive,
    starempty,
    starfull,
    finger,
    shareimage,
    terminalslist
};

class IconComponent extends Component {
    constructor() {
        super();

        this.state = {};
    }

    getDimensions = (props) => {
        const { height: propsHeight, width: propsWidth } = props;
        const svgNode = ReactDOM.findDOMNode(this).firstChild; // eslint-disable-line react/no-find-dom-node

        if (svgNode && (propsHeight || propsWidth)) {
            const { width, height } = svgNode.getBBox();
            const _width = width || 1;
            const _height = height || 1;
            let newHeight = _height;
            let newWidth = _width;

            let percent = 1;

            if (propsHeight) {
                percent = propsHeight / _height;
            }

            if (propsWidth) {
                percent = propsWidth / _width;
            }

            newWidth = propsWidth || newWidth * percent;
            newHeight = propsHeight || newHeight * percent;

            return {
                height: newHeight,
                width: newWidth
            };
        }
    }

    componentWillReceiveProps(nextProps) {
        const newSizes = this.getDimensions(nextProps);

        if (newSizes) {
            this.setState(newSizes);
        }
    }

    componentDidMount() {
        const newSizes = this.getDimensions(this.props);

        if (newSizes) {
            this.setState(newSizes);
        }
    }

    renderIcon(inProps) {
        const {
            name,
            color,
            ...props
        } = inProps;

        const { height, width } = this.state;

        const Icon = icons[name];
        const styles = {
            height,
            width
        };

        let iconString;

        if (Icon) {
            iconString = renderToString(<Icon {...styles} {...props} />);

            if (color) {
                iconString = iconString.replace(/fill="#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?"/gi, `fill="${color}"`);
            }
        }

        return iconString;
    }

    render() {
        const {
            className,
            backgroundColor,
            ...props
        } = this.props;
        const htmlString = this.renderIcon(props);

        return (
            <span
                className={classNames({
                    [className]: !!className,
                    [styles.container]: true
                })}
                style={{
                    backgroundColor: backgroundColor,
                    fontSize: 0
                }}
                dangerouslySetInnerHTML={{
                    __html: htmlString
                }}
            />
        );
    }
}

IconComponent.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    className: PropTypes.string
};

IconComponent.defaultProps = {
    backgroundColor: 'transparent'
};

export default IconComponent;