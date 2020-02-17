const { app, ipcMain, BrowserWindow, Notification } = require('electron');

function createWindow () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  window.loadFile('index.html');
  window.webContents.on('did-finish-load', () => {
    window.webContents.send('myChannel', 'arg1');
  })
  window.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if(process.platform !== "darwin") {
    app.quit()
  }
})

app.on('activate', () => {
  if(BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})

ipcMain.on('async-message', (event, arg) => {
  console.log(arg);
  event.reply('async-reply', 'async-pong');
})

ipcMain.on('sync-message', (event, arg) => {
  console.log(arg);
  event.returnValue = 'pong';
});

ipcMain.handle('invoke-channel', (event, arg) => {
  console.log(arg);
  return `send back ${arg}`
})
