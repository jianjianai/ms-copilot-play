
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import html from 'rollup-plugin-html';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import downGoBingaiPass from '../plugins/downGoBingaiPass.mjs';

/**
 * @param {import('rollup').RollupOptions} rollupOptions 
 */
export function createRollupOptions(rollupOptions) {
    rollupOptions.plugins = [
        ...rollupOptions.plugins || [],
        downGoBingaiPass(),
        typescript(),
        json(),
        html({
            include: '**/*.html'
        }),
        compiler(),
    ];
    rollupOptions.external = id => (id.endsWith(".wasm"));
    return rollupOptions;
}