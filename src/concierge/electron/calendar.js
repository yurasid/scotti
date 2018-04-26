const CalendarAPI = require('node-google-calendar');
const moment = require('moment');

const CONSTANTS = require('./constants');

async function getStats(config) {
    calendar = new CalendarAPI(config);

    try {
        const list = await calendar.CalendarList.list({ showHidden: true });
        const calendars = list.items || [];
        const calendarList = {};
        const calendarId = {};

        const colors = await calendar.Colors.get();

        calendars.map((calendar) => {
            const {
                id,
                timeZone,
                backgroundColor: bgColor,
                summary
            } = calendar;
            const splitId = id.split('@');

            calendarList[splitId[0]] = {
                timeZone,
                summary,
                bgColor
            };

            calendarId[splitId[0]] = id;
        });

        return {
            calendarId,
            calendarList,
            colors
        };
    } catch (error) {
        throw error;
    }
}

const config = CONSTANTS.GOOGLE_CALENDAR;
let calendarList = {};
let calendar;
let colors = {};

getStats(config)
    .then(response => {
        calendarList = response.calendarList;
        config.calendarId = response.calendarId;
        colors = response.colors;

        calendar = new CalendarAPI(config);
    })
    .catch(error => {
        throw error;
    });


function mapEvent(event, calendar) {
    const {
        id,
        summary,
        description,
        colorId,
        attachments,
        start: {
            date: startDate,
            dateTime: startDateTime
        },
        end: {
            date: endDate,
            dateTime: endDateTime
        },
        location
    } = event;

    const { bgColor, summary: calendarTitle } = calendarList[calendar];
    let background;

    if (colorId) {
        background = colors.event[colorId].background;
    }

    const result = {
        id,
        attachments,
        calendar,
        calendarTitle,
        title: summary,
        desc: description,
        bgColor: background || bgColor,
        startDate: startDate,
        startTime: startDateTime,
        endDate: endDate,
        endTime: endDateTime,
        location
    };

    return result;
}

module.exports.mapEvent = mapEvent;

async function getEventsForCalendar(calID) {
    const params = {
        timeMin: moment().startOf('month').toISOString(),
        timeMax: moment().endOf('month').toISOString()
    };

    try {
        const events = await calendar.Events.list(config.calendarId[calID], params, {});
        const responseEvents = events.map((event) => {
            return mapEvent(event, calID);
        });

        return responseEvents;
    } catch (error) {
        throw error;
    }
}

module.exports.getEvents = async function (calendarId) {
    const calendarsEvents = [];
    const calendars = calendarId ? [calendarId] : config.calendarId;

    for (let calendarId in calendars) {
        if (calendars.hasOwnProperty(calendarId)) {
            try {
                const calendarEvents = await getEventsForCalendar(calendarId);
                calendarsEvents.push(calendarEvents);
            } catch (error) {
                // do nothing
            }
        }
    }

    return [].concat.apply([], calendarsEvents);
};

module.exports.getEvent = async function (calID, id) {
    if (!calID || !id) {
        return false;
    }

    try {
        const event = await calendar.Events.get(config.calendarId[calID], id, {});
        const responseEvent = mapEvent(event, calendar);

        return responseEvent;
    } catch (error) {
        throw error;
    }
};