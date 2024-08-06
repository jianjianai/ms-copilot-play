import { createRollupOptions } from './all.main.mjs';
import copyFile from '../plugins/copyFile.mjs';

export default createRollupOptions({
    input: 'src/cloudflare.pages.ts',
    output: [
        {
            file: 'functions/_middleware.js',
            format: 'es'
        }
    ],
    plugins:[
        copyFile('go-bingai-pass.wasm','functions/go-bingai-pass.wasm')
    ]
});
