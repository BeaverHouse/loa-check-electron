import * as path from "path";
import * as url from "url";

import { app, BrowserWindow, clipboard } from "electron";
import * as isDev from "electron-is-dev";

const baseUrl: string = "http://localhost:3000";

let mainWindow: BrowserWindow | null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 650,
    minWidth: 650,
    height: 850,
    title: "로스트아크 군장검사",
    icon: __dirname + "/logo192.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });
  
  const mainWindowUrl: string = url.pathToFileURL(path.join(__dirname, '../build/index.html')).toString();

  mainWindow.loadURL(isDev ? baseUrl : mainWindowUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  if (process.platform === 'win32')
  {
    app.setAppUserModelId(app.name);
  }

  mainWindow.on("closed", (): void => {
    mainWindow = null;
  });
}

app.on("ready", (): void => {
  createMainWindow();
});

app.on("window-all-closed", (): void => {
  app.quit();
});

app.on("activate", (): void => {
  if (mainWindow === null) {
    createMainWindow();
  }
});