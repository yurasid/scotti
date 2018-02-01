import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types';

import username from '../../images/icons/user-name-icon.svg';
import password from '../../images/icons/password-icon.svg';
import showpass from '../../images/icons/icon-show-password.svg';
import hidepass from '../../images/icons/icon-hide-password.svg';
import logodef from '../../images/icons/logo-def.svg';
import logout from '../../images/icons/logout-icon.svg';
import tech from '../../images/icons/tech-support.svg';
import usericon from '../../images/icons/icon-user.svg';
import scottilogo from '../../images/icons/scotti.svg';
import bellpressed from '../../images/icons/concierge-bell-pressed.svg';
import bell from '../../images/icons/concierge-bell.svg';

const icons = {
    username,
    password,
    showpass,
    hidepass,
    logodef,
    logout,
    tech,
    usericon,
    scottilogo,
    bellpressed,
    bell
};

class IconComponent extends Component {
    constructor() {
        super();

        this.state = {};
    }

    componentDidMount() {
        const { height: propsHeight, width: propsWidth } = this.props;
        const svgNode = ReactDOM.findDOMNode(this).firstChild; // eslint-disable-line react/no-find-dom-node

        if (svgNode && (propsHeight || propsWidth)) {
            const { width, height } = svgNode.getBBox();
            let newHeight = height;
            let newWidth = width;

            let percent = 1;

            if (propsHeight) {
                percent = propsHeight / height;
            }

            if (propsWidth) {
                percent = propsWidth / width;
            }

            newWidth = propsWidth || width * percent;
            newHeight = propsHeight || height * percent;

            this.setState({
                height: newHeight,
                width: newWidth
            });
        }
    }

    renderIcon() {
        const {
            name,
            color,
            ...props
        } = this.props;

        const { height, width } = this.state;

        const Icon = icons[name];
        const styles = {
            height,
            width
        };

        let iconString;

        if (height) {
            styles.height = height;
        }

        if (width) {
            styles.width = width;
        }

        if (Icon) {
            iconString = renderToString(<Icon {...styles} {...props} />);

            if (color) {
                iconString = iconString.replace(/fill="#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?"/gi, `fill="${color}"`);
            }
        }

        return iconString;
    }

    render() {
        const htmlString = this.renderIcon();

        return (
            <span dangerouslySetInnerHTML={{
                __html: htmlString
            }} />
        );
    }
}

IconComponent.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
};

export default IconComponent;