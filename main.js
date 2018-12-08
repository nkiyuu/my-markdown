const fs = require('fs');
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const globalShortcut = electron.globalShortcut;

let win = null;

const createWindow = (() => {
  // Create the browser window
  win = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app
  win.loadFile('index.html');

  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null; 
  });

  win.webContents.on('found-in-page', (event, result) => {

  });
});

app.on('ready', createWindow);

//Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

const openFile = (event) => {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function(file) {
    if (!file) {
      return;
    }

    fs.readFile(file[0], 'utf8', (err, data) => {
      if (err) {
        return;
      }

      event.sender.send('selected-file', data);
    });
  });
}

const saveFile = (event, data) => {
  const options = {
    title: 'ファイルを保存',
  }
  dialog.showSaveDialog(options, (file) => {
    fs.writeFileSync(file, data);
  });
}

ipc.on('open-file-dialog', openFile);
ipc.on('save-file-dialog', saveFile);

const search = (event, text) => {
  win.webContents.findInPage(text);
}

ipc.on('search-text', search);
