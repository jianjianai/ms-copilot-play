import { createRollupOptions } from './all.main.mjs';
import copyFile from '../plugins/copyFile.mjs';
import { join } from 'path';
import writeFile from '../plugins/writeFile.mjs';

const outputPath = process.env.VERCEL_URL ? '/vercel/output' : "./.vercel/output";
export default createRollupOptions({
    input: 'src/netlify.ts',
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
            "entrypoint": "server.js"
        })),
        writeFile('./dist/index.html', '<html><body><h1>vercel error</h1></body></html>'),
    ]
});
