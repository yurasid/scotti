const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const fs = require('fs');
const sync = require('glob').sync;
const bodyParser = require('body-parser');
const session = require('express-session');
const CONSTANTS = require('./constants');

const { getEvents, getEvent } = require('./calendar');

const app = express();

app.use(bodyParser.json({ strict: false, limit: 1024 * 1024 * 200 }));
app.use(bodyParser.urlencoded({ extended: false, limit: 1024 * 1024 * 200 }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(express.static(path.resolve(__dirname)));

app.use('/api', proxy(CONSTANTS.BACKEND_URL, {
    preservHostHdr: true,
    proxyReqPathResolver: req => req.url
}));

app.get('/calendar/events/:id/:calendarId', async (req, res) => {
    const eventId = req.params.id;
    const calendarId = req.params.calendarId || 'primary';

    try {
        const event = await getEvent(calendarId, eventId);

        res.status(200).send(event);
    } catch (error) {
        console.log(error); //eslint-disable-line
    }
});

app.get('/calendar/events', async (req, res) => {
    try {
        const events = await getEvents();

        res.status(200).send(events);
    } catch (error) {
        console.log(error); //eslint-disable-line
    }
});

app.get('/translations/:lang', (req, res) => {
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
        messages: JSON.parse(fs.readFileSync(filepath, 'utf8'))
    });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

app.listen(9000, () => {
    console.log('React Concierge part at: http://localhost:9000'); // eslint-disable-line no-console
});