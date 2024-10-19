import { electronAPI } from '@electron-toolkit/preload'
import { proxyConfig } from './porxyCopilot'

// Custom APIs for renderer
const api = {
  proxyConfig: proxyConfig
}
export type Api = typeof api;
// @ts-ignore (define in dts)
window.electron = electronAPI
// @ts-ignore (define in dts)
window.api = api



