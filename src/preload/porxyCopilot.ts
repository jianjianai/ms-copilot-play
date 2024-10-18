import { electronAPI } from "@electron-toolkit/preload";

export const proxyConfig = (() => {
    let proxyHost;
    let proxyFIP;
    const onchanges:(()=>void)[] = [];
    let loadedPromise = new Promise((resolve) => {
        let resolveed = false;
        electronAPI.ipcRenderer.on('proxyConfig', (event, arg) => {
            if (arg?.proxyHost) proxyHost = arg.proxyHost;
            if (arg?.proxyFIP) proxyFIP = arg.proxyFIP;
            console.log('proxyConfig:', { proxyHost, proxyFIP });
            onchanges.forEach(t=>t());
            if(!resolveed){
                resolveed = true;
                resolve({ proxyHost, proxyFIP });
            }
        });
        electronAPI.ipcRenderer.send('proxyConfig');
    });
    return {
        onLoaded:(t:()=>void) => loadedPromise.then(t),
        onchange:(t:()=>void) => onchanges.push(t),
        get proxyHost() {
            return proxyHost;
        },
        get proxyFIP() {
            return proxyFIP;
        },
        set proxyHost(value: string) {
            proxyHost = value;
            electronAPI.ipcRenderer.send('proxyConfig', { proxyHost: value });
        },
        set proxyFIP(value: string) {
            proxyFIP = value;
            electronAPI.ipcRenderer.send('proxyConfig', { proxyFIP: value });
        }
    }
})();

const myWebSocket = window.WebSocket;
const WebSocketProxyHandler = {
    construct(target: any, args: any[]) {
        console.log('WebSocket is being constructed with arguments:', args);
        const url = new URL(args[0]);
        if (url.hostname == "copilot.microsoft.com" && url.pathname.startsWith("/c/api")) {
            url.host = proxyConfig.proxyHost;
            args[0] = url.toString();
        }
        return new target(...args);
    }
};
const WebSocketProxy = new Proxy(myWebSocket, WebSocketProxyHandler);
window.WebSocket = WebSocketProxy;