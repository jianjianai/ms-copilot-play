import { createRollupOptions } from './all.main.mjs';
import copyFile from '../plugins/copyFile.mjs';
import { join } from 'path';
import writeFile from '../plugins/writeFile.mjs';

const outputPath = process.env.VERCEL_URL ? '/vercel/output' : "./.vercel/output";
export default createRollupOptions({
    input: 'src/cloudflare.workers.ts',
    output: [
        {
            file: join(outputPath, "functions/api/server.func/server.js"),
            format: 'es',
        }
    ],
    plugins: [
        copyFile('go-bingai-pass.wasm', join(outputPath, "functions/api/server.func/go-bingai-pass.wasm")),
        writeFile(join(outputPath, "functions/api/server.func/.vc-config.json"), JSON.stringify({
            "runtime": "edge",
            "deploymentTarget": "v8-worker",
            "entrypoint": "verceldown.js"
        })),
        writeFile(join(outputPath, "config.json"), JSON.stringify({
            "version": 3,
            "routes": [
                {
                    "src": "^/.*$",
                    "dest": "/api/server"
                }
            ],
            "framework": {
                "version": "5.3.3"
            },
            "crons": []
        }
        )),
    ]
});
