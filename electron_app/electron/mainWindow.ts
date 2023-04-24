import { app, BrowserWindow } from "electron";
import path from "path";
import EventEmitter from "events";
// import ConfigureDev from "./configureDev";

import serve from "electron-serve";

class ConfigureDev {
  loadURL: any;

  constructor() {
    this.loadURL = null;
    this._serve_Dist();
  }

  _serve_Dist() {
    this.loadURL = serve({ directory: "www" });
  }

}

const appName = "Electron App";

const defaultSettings = {
  title: "Electron App",
  // width: 854,
  // height: 480,
};



class Main {
  window!: BrowserWindow;
  settings: { [key: string]: any };
  onEvent: EventEmitter = new EventEmitter();
  configDev: ConfigureDev;

  constructor(
    settings: { [key: string]: any } | null = null,
  ) {
    this.settings = settings ? { ...settings } : { ...defaultSettings };


    this.configDev = new ConfigureDev();

    app.on("ready", async () => {
      let loading = new BrowserWindow({
        show: false,
        frame: false,
        width: 300,
        height: 300,
        transparent: true,
      });

      // this.window = await this.createWindow();
      // this.onEvent.emit("window-created");

      loading.once("show", async () => {
        this.window = await this.createWindow();
        this.onEvent.emit("window-created");
        loading.hide();
        loading.close();
      });
      loading.loadURL(path.join("www", "loading.html"));
      loading.show();
    });

    app.on("window-all-closed", this.onWindowAllClosed);
    app.on("activate", this.onActivate);
  }

  async createWindow() {
    let settings = { ...this.settings };
    app.name = appName;
    let window = new BrowserWindow({
      ...settings,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    window.setMenu(null)
    window.maximize();
    
    try {
      await this.configDev.loadURL(window);
    } catch (error) {
      console.log(`this.configDev.loadURL(window);`);
      console.log(error);
    }

    window.show();

    return window;
  }

  onWindowAllClosed() {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }

  onActivate() {
    if (!this.window) {
      this.createWindow();
    }
  }
}

export default Main;
