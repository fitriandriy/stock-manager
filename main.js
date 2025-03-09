const { app, BrowserWindow } = require("electron");

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // Muat React Dev Server
  const startURL = 'http://localhost:3000';
  mainWindow.loadURL(startURL);

  // Buka DevTools (opsional untuk debugging)
  mainWindow.webContents.openDevTools();
});
