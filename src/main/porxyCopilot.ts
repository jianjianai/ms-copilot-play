import { app, ipcMain, session } from "electron";
import { getLocalCookiesToRequestHeader, setResponseHeadrCookiesToLocal } from "./cookie";


//拦截网络
app.whenReady().then(() => {
    const proxyHost = "8787-jianjianai-mscopilotpla-u1az71ch21f.ws-us116.gitpod.io";
    const porxyFIP = "104.28.1.144";
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
            headers["MCPXXX-FIP"] = porxyFIP;
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
    ipcMain.on('ping', () => console.log('pong'))
});