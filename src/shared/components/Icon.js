import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types';

import username from '!svg-react-loader?name=username!../images/user-name-icon.svg';
import password from '!svg-react-loader?name=password!../images/password-icon.svg';
import showpass from '!svg-react-loader?name=showpass!../images/icon-show-password.svg';
import hidepass from '!svg-react-loader?name=hidepass!../images/icon-hide-password.svg';
import logodef from '!svg-react-loader?name=logodef!../images/logo-def.svg';
import logout from '!svg-react-loader?name=logout!../images/logout-icon.svg';
import tech from '!svg-react-loader?name=tech!../images/tech-support.svg';
import usericon from '!svg-react-loader?name=usericon!../images/icon-user.svg';
import scottilogo from '!svg-react-loader?name=scottilogo!../images/scotti.svg';

const icons = {
    username,
    password,
    showpass,
    hidepass,
    logodef,
    logout,
    tech,
    usericon,
    scottilogo
};

class IconComponent extends Component {
    constructor() {
        super();

        this.state = {};
    }

    componentDidMount() {
        const { height: propsHeight, width: propsWidth } = this.props;
        const svgNode = ReactDOM.findDOMNode(this).firstChild;

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