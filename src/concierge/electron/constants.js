const path = require('path');

const GOOGLE_JSON = require('./google_calendar.json');

const BACKEND_IP = '199.247.12.39';

module.exports = {
    BACKEND_URL: `http://${BACKEND_IP}`,
    LANG_DIR: path.resolve(__dirname, './lang'),
    GOOGLE_CALENDAR: {
        key: GOOGLE_JSON.private_key,
        serviceAcctId: GOOGLE_JSON.client_email,
        timezone: 'UTC+02:00'
    }
};