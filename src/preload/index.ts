import { electronAPI } from '@electron-toolkit/preload'
import { proxyConfig } from './porxyCopilot'
import { pFetch } from './pFetch';

// Custom APIs for renderer
const api = {
  proxyConfig: proxyConfig,
  pFetch: pFetch
}
export type Api = typeof api;
// @ts-ignore (define in dts)
window.electron = electronAPI
// @ts-ignore (define in dts)
window.api = api



