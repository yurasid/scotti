/* eslint-disable */
const electron = require('electron');
const path = require('path');
const os = require('os');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

require('./server.js');

let mainWindow;

function createWindow() {
    const platform = os.platform();

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        maximizable: false,
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, platform === 'win32' ? './icons/win/icon.ico' : './icons/png/64.png')
    });

    mainWindow.maximize();

    mainWindow.loadURL('http://localhost:9000/');

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