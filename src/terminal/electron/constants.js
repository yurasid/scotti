const path = require('path');

const BACKEND_IP = '192.168.88.225';

module.exports = {
    BACKEND_URL: `http://${BACKEND_IP}`,

    LANG_DIR: path.resolve(__dirname, './lang')
};