import { electronAPI } from '@electron-toolkit/preload'
import './porxyCopilot'

// Custom APIs for renderer
const api = {}
// @ts-ignore (define in dts)
window.electron = electronAPI
// @ts-ignore (define in dts)
window.api = api



