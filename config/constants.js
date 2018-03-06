const path = require('path');

const DIST = path.resolve(__dirname, '../dist');
const SRC = path.resolve(__dirname, '../src');
const MESSAGES_DIR = path.resolve(DIST, './messages');
const BACKEND_IP = '45.77.138.235';

module.exports = {
    BACKEND_IP,
    BACKEND_SOCKET_URL: `ws://${BACKEND_IP}:6001`,

    SRC: SRC,

    CONCIERGE_SRC: path.resolve(SRC, './concierge'),
    TERMINAL_SRC: path.resolve(SRC, './terminal'),
    SHARED_SRC: path.resolve(SRC, './shared'),

    DIST: DIST,

    CONCIERGE_DIST: path.resolve(DIST, './concierge'),
    TERMINAL_DIST: path.resolve(DIST, './terminal'),

    MESSAGES_DIR: MESSAGES_DIR,
    CONCIERGE_MESSAGES_PATTERN: path.resolve(MESSAGES_DIR, './src/concierge') + '/**/*.json',
    TERMINAL_MESSAGES_PATTERN: path.resolve(MESSAGES_DIR, './src/terminal') + '/**/*.json',

    CONCIERGE_LANG_DIR: path.resolve(DIST, './concierge/lang'),
    TERMINAL_LANG_DIR: path.resolve(DIST, './terminal/lang')
};