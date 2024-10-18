import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

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
  function isProxyPath(path: string) {
    if (path.startsWith("/c/api")) return true;
    return false;
  }
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const url = new URL(details.url);
    if (url.hostname == "copilot.microsoft.com" && isProxyPath(url.pathname)) {
      url.host = proxyHost;
      callback({ redirectURL: url.toString() });
      return;
    }
    callback({});
  });
  session.defaultSession.webRequest.onBeforeSendHeaders(async (details, callback) => {
    const url = new URL(details.url);
    if (url.hostname == proxyHost && isProxyPath(url.pathname)) {
      const headers = details.requestHeaders;
      headers["MCPXXX-TO-HOST"] = "copilot.microsoft.com";
      headers["MCPXXX-FIP"] = "104.28.1.144";
      //设置cookie
      url.host = "copilot.microsoft.com";
      const localCookies = await getLocalCookiesToRequestHeader(url.toString());
      if (localCookies) {
        headers["cookie"] = localCookies;
      }
      callback({ requestHeaders: headers });
      return;
    }
    callback({});
  });
  session.defaultSession.webRequest.onHeadersReceived(async (details, callback) => {
    const url = new URL(details.url);
    if (url.hostname == proxyHost && isProxyPath(url.pathname)) {
      const headers = details.responseHeaders || {};
      url.host = "copilot.microsoft.com";
      await setResponseHeadrCookiesToLocal(headers["set-cookie"], url.toString());
      callback({ responseHeaders: headers });
      return;
    }
    callback({});
  });
})

async function getLocalCookiesToRequestHeader(url: string) {
  const cookies = await session.defaultSession.cookies.get({ url: url });
  if (cookies.length > 0) {
    return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
  }
  return undefined;
}

async function setResponseHeadrCookiesToLocal(serCookies: string | string[] | undefined | null, url: string) {
  if (!serCookies) {
    return;
  }
  if (!Array.isArray(serCookies)) {
    serCookies = serCookies.split(',').map(cookie => cookie.trim());
  }
  for (const setCookie of serCookies) {
    const parsedCookie = parseSetCookieHeader(setCookie); // 解析 Set-Cookie 头部
    parsedCookie.httpOnly = false; // 为了能够在浏览器中访问到 Cookie，需要将 httpOnly 设置为 false
    if (parsedCookie) {
      console.log(parsedCookie);
      try {
        await session.defaultSession.cookies.set({ ...parsedCookie, url: url });  // 保存 Cookie
      } catch (e) {
        console.log(e);
      }
    }
  }

  // 解析 'Set-Cookie' 头部 01-Jan-1970 08:00:00 GMT; path=/; secure; SameSite=None
  function parseSetCookieHeader(setCookieHeader: string) {
    console.log(setCookieHeader);
    const cookie: {
      name?: string,
      value?: string,
      expirationDate?: number,
      domain?: string,
      path?: string,
      secure?: boolean,
      httpOnly?: boolean
    } = {};
    const parts = setCookieHeader.split(';');
    const firstEqualIndex = parts[0].indexOf('=');
    const name = parts[0].substring(0, firstEqualIndex).trim();
    const value = parts[0].substring(firstEqualIndex + 1).trim();
    cookie.name = name;
    cookie.value = value;
    for (const part of parts.slice(1)) {
      const equalIndex = part.indexOf('=');
      const key = equalIndex > -1 ? part.substring(0, equalIndex) : part;
      const val = equalIndex > -1 ? part.substring(equalIndex + 1) : '';
      const lowerKey = key.trim().toLowerCase();
      switch (lowerKey) {
        case 'expires':
          cookie.expirationDate = new Date(val.trim()).getTime() / 1000;
          break;
        case 'domain':
          cookie.domain = val.trim();
          break;
        case 'path':
          cookie.path = val.trim();
          break;
        case 'secure':
          cookie.secure = true;
          break;
        case 'httponly':
          cookie.httpOnly = true;
          break;
      }
    }
    return cookie;
  }
}





