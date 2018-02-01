const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

require('./server.js');

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 600, 
        height: 900
    });

    mainWindow.loadURL('http://localhost:9001/');

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