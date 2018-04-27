import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { MdAccessTime, MdEvent, MdDescription, MdAttachFile } from 'react-icons/lib/md';


import { setSelectedEvent } from '../../../../shared/redux/actions/calendar';


class EventPopup extends Component {
    static propTypes = {
        event: PropTypes.shape({
            title: PropTypes.string,
            desc: PropTypes.string,
            bgColor: PropTypes.string,
            attachments: PropTypes.array,
            measure: PropTypes.shape({
                left: PropTypes.number,
                top: PropTypes.number,
                width: PropTypes.number,
                height: PropTypes.number
            })
        }),
        overlay: PropTypes.shape({
            top: PropTypes.number,
            left: PropTypes.number,
            width: PropTypes.number,
            height: PropTypes.number
        }).isRequired,
        setSelectedEventDispatch: PropTypes.func.isRequired
    }

    constructor() {
        super();

        this.state = {
            width: 0,
            height: 0
        };
    }

    componentDidMount() {
        const { width, height } = this.popup.getBoundingClientRect();

        this.setState({
            width,
            height
        });
    }

    render() {
        const {
            setSelectedEventDispatch,
            event: {
                title,
                bgColor,
                calendarTitle,
                start,
                end,
                allDay,
                desc,
                attachments,
                measure: {
                    top: eventTop,
                    left: eventLeft,
                    width: eventWidth,
                    height: eventHeight
                }
            },
            overlay: {
                top: overlayTop,
                left: overlayLeft,
                height: overlayHeight,
                width: overlayWidth
            }
        } = this.props;

        console.log(start, end); //eslint-disable-line

        const { width, height } = this.state;
        const styles = {
            color: bgColor,
            top: eventTop - overlayTop,
            left: eventLeft - overlayLeft
        };

        if (styles.left + eventWidth + width > overlayWidth) {
            styles.left = styles.left - width;
        } else {
            styles.left = styles.left + eventWidth;
        }

        if (styles.top + height > overlayHeight) {
            styles.top = styles.top - height + eventHeight;
        }

        const formatString = allDay ? 'ddd, D MMM YYYY' : 'ddd, D MMM, HH:mm';

        return (
            <Fragment>
                {event && (
                    <div
                        ref={ref => this.popup = ref}
                        className='popupContainer'
                        style={styles}
                    >
                        <div className='popupWrapper'>
                            <div className='titleBlock'>
                                <span
                                    className='closeBtn'
                                    onClick={() => setSelectedEventDispatch(null)}
                                />
                                <span>{title}</span>
                            </div>
                            <div className='contentBlock'>
                                <span>
                                    <MdAccessTime />
                                    {
                                        allDay ? moment(start).format(formatString) :
                                            `${moment(start).format(formatString)} - ${moment(end).format(formatString)}`
                                    }</span>
                                <div
                                    className='description'
                                >
                                    <MdDescription />
                                    <div
                                        dangerouslySetInnerHTML={{ __html: desc }}
                                    />
                                </div>
                                {attachments && (
                                    <div
                                        className='attachments'
                                    >
                                        <MdAttachFile />
                                        <ul>
                                            {attachments.map(attachment => (
                                                <li key={attachment.fileId}>
                                                    <a
                                                        href={attachment.fileUrl}
                                                        rel='noopener noreferrer'
                                                        title={attachment.title}
                                                        target='_blank'
                                                    >
                                                        <img src={attachment.iconLink} />
                                                        <span>{attachment.title}</span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <span><MdEvent />{calendarTitle}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setSelectedEventDispatch: setSelectedEvent
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(EventPopup);