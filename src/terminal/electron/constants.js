const path = require('path');

const BACKEND_IP = '45.77.138.235';

module.exports = {
    BACKEND_URL: `http://${BACKEND_IP}`,
    LANG_DIR: path.resolve(__dirname, './lang')
};