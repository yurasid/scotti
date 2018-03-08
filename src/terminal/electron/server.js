const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const fs = require('fs');
const sync = require('glob').sync;
const bodyParser = require('body-parser');
const CONSTANTS = require('./constants');
const util = require('util');
const logger = require('./logger')(module);

const readFile = util.promisify(fs.readFile);

module.exports = function (electronApp) {
    const app = express();

    app.use(bodyParser.json({ strict: false, limit: 1024 * 1024 * 200 }));
    app.use(bodyParser.urlencoded({ extended: false, limit: 1024 * 1024 * 200 }));

    app.use(express.static(path.resolve(__dirname)));

    app.post('/logger', (req, res) => {
        const { body: { level, message, label = 'UI' } } = req;
        logger[level](message, { label });
        res.status(200).send({});
    });

    app.use('/api/terminal/login', proxy(CONSTANTS.BACKEND_URL, {
        preservHostHdr: true,
        proxyReqPathResolver: req => `${req.url}terminal/login`,
        proxyReqBodyDecorator: async (reqBody) => {
            const filePath = path.resolve(electronApp.getPath('userData'), 'user.json');
            let body = {};

            try {
                body = JSON.parse(await readFile(filePath, 'utf-8'));
            } catch (e) {
                throw e;
            }

            return JSON.stringify(Object.assign({}, reqBody, body));
        }
    }));

    app.use('/api', proxy(CONSTANTS.BACKEND_URL, {
        preservHostHdr: true,
        proxyReqPathResolver: req => req.url
    }));

    app.get('/translations/:lang', async (req, res) => {
        const language = req.params.lang;
        const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
        const filepath = sync(`${CONSTANTS.LANG_DIR}/*.json`)
            .sort()
            .find((filepath) => {
                const filename = path.basename(filepath, '.json');

                return filename === language || filename === languageWithoutRegionCode;
            }) || `${CONSTANTS.LANG_DIR}/en.json`;

        res.json({
            locale: path.basename(filepath, '.json'),
            messages: JSON.parse(await readFile(filepath, 'utf8'))
        });
    });

    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

    app.listen(9001, () => {
        console.log('React Terminal part at: http://localhost:9001'); // eslint-disable-line no-console
    });
};

/* const app = express();

app.use(bodyParser.json({ strict: false, limit: 1024 * 1024 * 200 }));
app.use(bodyParser.urlencoded({ extended: false, limit: 1024 * 1024 * 200 }));

app.use(express.static(path.resolve(__dirname)));

app.post('/logger', (req, res) => {
    const { body: { level, message, label = 'UI' } } = req;
    logger[level](message, { label });
    res.status(200).send({});
});

app.use('/api', proxy(CONSTANTS.BACKEND_URL, {
    preservHostHdr: true,
    proxyReqPathResolver: req => req.url
}));

app.get('/translations/:lang', async (req, res) => {
    const language = req.params.lang;
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
    const filepath = sync(`${CONSTANTS.LANG_DIR}/*.json`)
        .sort()
        .find((filepath) => {
            const filename = path.basename(filepath, '.json');

            return filename === language || filename === languageWithoutRegionCode;
        }) || `${CONSTANTS.LANG_DIR}/en.json`;

    res.json({
        locale: path.basename(filepath, '.json'),
        messages: JSON.parse(await readFile(filepath, 'utf8'))
    });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

app.listen(9001, () => {
    console.log('React Terminal part at: http://localhost:9001'); // eslint-disable-line no-console
});
*/