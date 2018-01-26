const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const fs = require('fs');
const sync = require('glob').sync;
const bodyParser = require('body-parser');
const CONSTANTS = require('../../config/constants');

const app = express();

app.use(bodyParser.json({ strict: false, limit: 1024 * 1024 * 200 }));
app.use(bodyParser.urlencoded({ extended: false, limit: 1024 * 1024 * 200 }));

app.use(express.static(path.resolve(__dirname)));

app.use('/api', proxy('http://192.168.88.247:8080', {
    preservHostHdr: true,
    proxyReqPathResolver: req => req.url
}));

app.get('/translations/:lang', (req, res) => {
    const language = req.params.lang;
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
    const filepath = sync(`${CONSTANTS.CONCIERGE_LANG_DIR}/*.json`)
        .sort()
        .find((filepath) => {
            const filename = path.basename(filepath, '.json');

            return filename === language || filename === languageWithoutRegionCode;
        }) || `${CONSTANTS.CONCIERGE_LANG_DIR}/en.json`;

    res.json({
        locale: path.basename(filepath, '.json'),
        messages: JSON.parse(fs.readFileSync(filepath, 'utf8'))
    });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

app.listen(9000, () => {
    console.log('React Concierge part at: http://localhost:9000'); // eslint-disable-line no-console
});