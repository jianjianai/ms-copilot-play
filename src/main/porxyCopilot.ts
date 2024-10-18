import { app, ipcMain, session } from "electron";
import { getLocalCookiesToRequestHeader, setResponseHeadrCookiesToLocal } from "./cookie";
//拦截网络
app.whenReady().then(() => {
    const proxyConfig = (() => {
        let proxyHost = "8787-jianjianai-mscopilotpla-u1az71ch21f.ws-us116.gitpod.io";
        let proxyFIP = "104.28.1.144";
        ipcMain.on('proxyConfig', (event, arg) => {
            if (arg?.proxyHost) proxyHost = arg.proxyHost;
            if (arg?.proxyFIP) proxyFIP = arg.proxyFIP;
            event.reply('proxyConfig', { proxyHost, proxyFIP });
            console.log('proxyConfig:', { proxyHost, proxyFIP });
        });
        return {
            get proxyHost() {
                return proxyHost;
            },
            get proxyFIP() {
                return proxyFIP;
            },
            set proxyHost(value: string) {
                proxyHost = value;
                ipcMain.emit('proxyConfig', { proxyHost: value });
            },
            set proxyFIP(value: string) {
                proxyFIP = value;
                ipcMain.emit('proxyConfig', { proxyFIP: value });
            }
        }
    })();

    function isProxyPath(path: string) {
        if (path.startsWith("/c/api")) return true;
        return false;
    }
    session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
        const url = new URL(details.url);
        if (url.hostname == "copilot.microsoft.com" && isProxyPath(url.pathname)) {
            url.host = proxyConfig.proxyHost;
            callback({ redirectURL: url.toString() });
            return;
        }
        callback({});
    });
    session.defaultSession.webRequest.onBeforeSendHeaders(async (details, callback) => {
        const url = new URL(details.url);
        if (url.hostname == proxyConfig.proxyHost && isProxyPath(url.pathname)) {
            const headers = details.requestHeaders;
            headers["MCPXXX-TO-HOST"] = "copilot.microsoft.com";
            headers["MCPXXX-FIP"] = proxyConfig.proxyFIP;
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
        if (url.hostname == proxyConfig.proxyHost && isProxyPath(url.pathname)) {
            const headers = details.responseHeaders || {};
            url.host = "copilot.microsoft.com";
            await setResponseHeadrCookiesToLocal(headers["set-cookie"], url.toString());
            callback({ responseHeaders: headers });
            return;
        }
        callback({});
    });









});