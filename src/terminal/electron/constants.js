const path = require('path');

const BACKEND_IP = '199.247.12.39';

module.exports = {
    BACKEND_URL: `http://${BACKEND_IP}`,
    LANG_DIR: path.resolve(__dirname, './lang')
};