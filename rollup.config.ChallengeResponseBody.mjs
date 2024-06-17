import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { wasm } from '@rollup/plugin-wasm';

// rollup.config.mjs
// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
    input: 'src/html/ChallengeResponseBody.js',
    output: [
        {
            file: '.tmp/ChallengeResponseBody.js.txt',
            format: 'es'
        }
    ],
    plugins:[
        wasm({
            targetEnv:"auto-inline"
        }),
        compiler()
    ]
};
