import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}
// @ts-ignore (define in dts)
window.electron = electronAPI
// @ts-ignore (define in dts)
window.api = api

console.log(process.contextIsolated)

console.log('preload/index.ts loaded')

electronAPI.ipcRenderer.send('ping');

const myWebSocket = window.WebSocket;
const WebSocketProxyHandler = {
  construct(target: any, args: any[]) {
    console.log('WebSocket is being constructed with arguments:', args);
    const url = new URL(args[0]);
    if(url.hostname == "copilot.microsoft.com" && url.pathname.startsWith("/c/api")) {
      url.host = "8787-jianjianai-mscopilotpla-u1az71ch21f.ws-us116.gitpod.io";
      args[0] = url.toString();
    }
    return new target(...args);
  }
};
const WebSocketProxy = new Proxy(myWebSocket, WebSocketProxyHandler);
window.WebSocket = WebSocketProxy;

