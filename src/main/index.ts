import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as Cookies from './cookie';

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
  async function handle(request: GlobalRequest): Promise<Response> {
    const requestURL = new URL(request.url);
    if (requestURL.pathname == "/c/api/start") {
      return await sendFetch(request, { proxyHost: "8787-jianjianai-mscopilotpla-u1az71ch21f.ws-us116.gitpod.io" });
    }
    return await sendFetch(request);
  }
  session.defaultSession.protocol.handle('mcpahttps', handle);
  session.defaultSession.protocol.handle('mcpahttp', handle);


  session.defaultSession.webRequest.onBeforeRequest({
    urls: [
      "https://copilot.microsoft.com/c/api/start",
      "http://copilot.microsoft.com/c/api/start"
    ]
  }, (details, callback) => {
    const url = new URL(details.url);
    callback({ redirectURL: "mcpa" + url.protocol + "//" + url.host + url.pathname + url.search });
  });
})

async function sendFetch(request: GlobalRequest, config: { proxyHost?: string } = {}): Promise<Response> {
  let requestURL = new URL(request.url);
  if (requestURL.protocol.startsWith("mcpa")) {
    requestURL = new URL(requestURL.protocol.substring(4) + "//" + requestURL.host + requestURL.pathname + requestURL.search)
  }
  const cookieURL = requestURL.toString();
  const reqhost = requestURL.hostname;
  const headers = new Headers(request.headers);

  //设置cookie
  const cookies = await session.defaultSession.cookies.get({ url: cookieURL });
  if (cookies.length > 0) {
    const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    headers.set("Cookie", cookieHeader);
  }

  //如果代理
  if (config.proxyHost) {
    requestURL.hostname = config.proxyHost;
    //额外代理头
    headers.set("MCPXXX-TO-HOST", reqhost);
    headers.set("MCPXXX-FIP", "104.28.1.144");
  }

  console.log(requestURL.toString(), "----------------------------");
  console.log(headers)
  const respones = await fetch(requestURL, {
    ...request,
    headers: headers
  });
  console.log(respones.headers);

  //处理响应中的 'Set-Cookie' 头部并保存 Cookies
  const setCookieHeader = respones.headers.get('Set-Cookie');
  if (setCookieHeader) {
    const setCookieItems = setCookieHeader.split(',').map(item => item.trim());
    for (const setCookie of setCookieItems) {
      const parsedCookie = parseSetCookieHeader(setCookie); // 解析 Set-Cookie 头部
      if (parsedCookie) {
        await session.defaultSession.cookies.set({...parsedCookie,url:cookieURL});  // 保存 Cookie
      }
    }
  }

  return respones;
}

// 解析 'Set-Cookie' 头部
function parseSetCookieHeader(setCookieHeader:string) {
  const cookie:{
    name?:string,
    value?:string,
    expirationDate?:number,
    domain?:string,
    path?:string,
    secure?:boolean,
    httpOnly?:boolean
  } = {};
  const parts = setCookieHeader.split(/; ?/).map(part => part.trim());
  console.log(parts);
  for (const part of parts) {
    const index = part.indexOf("=");
    const name = index<0?part:part.substring(0,index);
    const value = index<0?"":part.substring(index+1);
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





