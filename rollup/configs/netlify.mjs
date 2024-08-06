import { createRollupOptions } from './all.main.mjs';
import copyFile from '../plugins/copyFile.mjs';
import { join } from 'path';
import writeFile from '../plugins/writeFile.mjs';

export default createRollupOptions({
    input: 'src/netlify.ts',
    output: [
        {
            file: "./.netlify/edge-functions/server/server.js",
            format: 'es',
        }
    ],
    plugins: [
        copyFile('go-bingai-pass.wasm', "./.netlify/edge-functions/server/go-bingai-pass.wasm"),
        writeFile("./.netlify/edge-functions/manifest.json", JSON.stringify({
            "version": 1,
            "functions": [
                {
                    "path": "/*",
                    "name": "ms copilot play",
                    "function": "server"
                }
            ]
        }))
    ]
});
