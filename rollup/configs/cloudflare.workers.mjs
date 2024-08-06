import { createRollupOptions } from './all.main.mjs';
import copyFile from '../plugins/copyFile.mjs';

export default createRollupOptions({
    input: 'src/cloudflare.workers.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'es',
        }
    ],
    plugins:[
        copyFile('go-bingai-pass.wasm','dist/go-bingai-pass.wasm')
    ]
});
