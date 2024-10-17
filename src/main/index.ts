import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as Cookies from './cookie';
import { url } from 'inspector';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  addIpcMainListen();

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
function addIpcMainListen() {
  ipcMain.on('ping', () => console.log('pong'))
}


//拦截网络
app.whenReady().then(() => {
  const proxyHost = "8787-jianjianai-mscopilotpla-u1az71ch21f.ws-us116.gitpod.io";
  function getUrls(host:string){
    return [
      `*://${host}/c/api/*`
    ]
  }
  session.defaultSession.webRequest.onBeforeRequest({
    urls: getUrls("copilot.microsoft.com"),
    types: ['mainFrame' , 'subFrame' , 'stylesheet' , 'script' , 'image' , 'font' , 'object' , 'xhr' , 'ping' , 'cspReport' , 'media' , 'webSocket']
  }, (details, callback) => {
    const url = new URL(details.url);
    console.log(details.url);
    url.host = proxyHost;
    callback({ redirectURL: url.toString()});
  });
  session.defaultSession.webRequest.onBeforeSendHeaders({
    urls: getUrls(proxyHost),
    types: ['mainFrame' , 'subFrame' , 'stylesheet' , 'script' , 'image' , 'font' , 'object' , 'xhr' , 'ping' , 'cspReport' , 'media' , 'webSocket']
  }, async (details, callback) => {
    const headers = details.requestHeaders;
    headers["MCPXXX-TO-HOST"] = "copilot.microsoft.com";
    headers["MCPXXX-FIP"] = "104.28.1.144";
    //设置cookie
    const cookieUrl = new URL(details.url);
    cookieUrl.host = "copilot.microsoft.com";
    headers["cookie"] = await getLocalCookiesToRequestHeader(cookieUrl.toString());

    callback({ requestHeaders: headers })
  });
  session.defaultSession.webRequest.onHeadersReceived({
    urls: getUrls(proxyHost),
    types: ['mainFrame' , 'subFrame' , 'stylesheet' , 'script' , 'image' , 'font' , 'object' , 'xhr' , 'ping' , 'cspReport' , 'media' , 'webSocket']
  }, async (details, callback) => {
    const headers = details.responseHeaders;
    const cookieUrl = new URL(details.url);
    cookieUrl.host = "copilot.microsoft.com";
    await setResponseHeadrCookiesToLocal(headers["set-cookie"], cookieUrl.toString());
    callback({ responseHeaders: headers })
  });
})

async function getLocalCookiesToRequestHeader(url: string) {
  const cookies = await session.defaultSession.cookies.get({ url: url });
  if (cookies.length > 0) {
    return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
  }
  return undefined;
}

async function setResponseHeadrCookiesToLocal(serCookies: string[] | undefined, url: string) {
  if (serCookies) {
    for (const setCookie of serCookies) {
      const parsedCookie = parseSetCookieHeader(setCookie); // 解析 Set-Cookie 头部
      if (parsedCookie) {
        await session.defaultSession.cookies.set({ ...parsedCookie, url: url });  // 保存 Cookie
      }
    }
  }

  // 解析 'Set-Cookie' 头部
  function parseSetCookieHeader(setCookieHeader: string) {
    const cookie: {
      name?: string,
      value?: string,
      expirationDate?: number,
      domain?: string,
      path?: string,
      secure?: boolean,
      httpOnly?: boolean
    } = {};
    const parts = setCookieHeader.split(/; ?/).map(part => part.trim());
    for (const part of parts) {
      const index = part.indexOf("=");
      const name = index < 0 ? part : part.substring(0, index);
      const value = index < 0 ? "" : part.substring(index + 1);
      if (!cookie.name) {
        cookie.name = name;
        cookie.value = value;
      } else if (name.toLowerCase() === 'expires') {
        cookie.expirationDate = new Date(value).getTime() / 1000;
      } else if (name.toLowerCase() === 'domain') {
        cookie.domain = value;
      } else if (name.toLowerCase() === 'path') {
        cookie.path = value;
      } else if (name.toLowerCase() === 'secure') {
        cookie.secure = true;
      } else if (name.toLowerCase() === 'httponly') {
        cookie.httpOnly = true;
      }
    }
    return cookie;
  }
}





