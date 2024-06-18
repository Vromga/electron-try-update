const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  function sendStatusToWindow(text) {
    win.webContents.send('message', text);
  }

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
    sendStatusToWindow('Checking for update...');
  });
  autoUpdater.on('update-available', (info) => {
    log.info('Update available.', info);
    sendStatusToWindow('Update available.');
  });
  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available.', info);
    sendStatusToWindow('Update not available.');
  });
  autoUpdater.on('error', (err) => {
    log.info('Update not available.', err);
    sendStatusToWindow('Error in auto-updater. ' + err);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    log.info(log_message);
    sendStatusToWindow(log_message);
  });
  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded', info);
    sendStatusToWindow('Update downloaded');
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});


