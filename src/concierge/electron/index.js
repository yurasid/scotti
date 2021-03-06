/* eslint-disable */
const electron = require('electron');
const path = require('path');
const os = require('os');

const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

require('./server.js');

let mainWindow;

function createWindow() {
    const platform = os.platform();

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        maximizable: false,
        resizable: true,
        titleBarStyle: 'hiddenInset',
        title: 'Concierge App',
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, platform === 'win32' ? './icons/win/icon.ico' : './icons/png/64.png')
    });

    mainWindow.once('ready-to-show', function () {
        mainWindow.show();
    });

    mainWindow.maximize();

    mainWindow.loadURL('http://localhost:9000/');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    ipcMain.on('incoming-call', () => {
        mainWindow.flashFrame(true);
    });

    ipcMain.on('call-started', () => {
        mainWindow.flashFrame(false);
    });

    mainWindow.flashFrame(false);
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