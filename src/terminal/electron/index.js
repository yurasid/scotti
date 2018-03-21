const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
    require('./server.js')(app);

    const screenElectron = electron.screen;
    const mainScreen = screenElectron.getPrimaryDisplay();
    const dimensions = mainScreen.workAreaSize;

    mainWindow = new BrowserWindow({
        width: dimensions.height * 1080 / 1920, 
        height: dimensions.height,
        kiosk: false,
        show: false
    });

    mainWindow.loadURL('http://localhost:9001/');

    mainWindow.once('ready-to-show', function () {
        mainWindow.show();
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