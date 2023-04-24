import { app } from "electron";
import { ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import Main from "./mainWindow";
import globals from "./globals";

import systemInfo from "@el3um4s/ipc-for-electron-system-info";

import updaterInfo from "./IPC/updaterInfo";
import fileSystem from "./IPC/fileSystem";

import path from "path";
import { pathToFileURL } from "node:url";


const mainURLPATH = pathToFileURL(path.join("www", "index.html"));

globals.set.mainURL(mainURLPATH.href);
globals.set.preloadjs(path.join(__dirname, "preload.js"));

app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendArgument("disable-gpu");
app.commandLine.appendSwitch("enable-experimental-web-platform-features");

const windowSettings = {
  title: "Electron_App",
  // width: 854,
  // height: 854,
};

let main = new Main(windowSettings);

main.onEvent.on("window-created", async () => {
  systemInfo.initIpcMain(ipcMain, main.window);
  updaterInfo.initIpcMain(ipcMain, main.window);
  fileSystem.initIpcMain(ipcMain, main.window);
  updaterInfo.initAutoUpdater(autoUpdater, main.window);
});
