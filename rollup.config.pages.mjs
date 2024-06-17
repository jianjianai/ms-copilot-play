import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { string } from "rollup-plugin-string";

// rollup.config.mjs
// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
    input: 'src/pages.ts',
    output: [
        {
            file: 'functions/_middleware.js',
            format: 'es'
        }
    ],
    plugins: [
        typescript(),
        json(),
        string({
            include: ["**/*.html","**/*.txt"],
        }),
        compiler(),
    ]
};
