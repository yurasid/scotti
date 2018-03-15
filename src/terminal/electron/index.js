const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


let mainWindow;

function createWindow () {
    require('./server.js')(app);
    mainWindow = new BrowserWindow({
        width: 600, 
        height: 900,
        kiosk: false,
        show: false
    });

    mainWindow.loadURL('http://localhost:9001/');

    mainWindow.once('ready-to-show', function() {
        mainWindow.show();
        mainWindow.openDevTools();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});