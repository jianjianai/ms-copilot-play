import { Downloader } from 'nodejs-file-downloader';
import { existsSync } from 'fs';

/** @returns {import('rollup').Plugin} */
export default function downGoBingaiPass() {
  return {
    name: 'DownGoBingaiPass',
    buildStart: async () => {
      //下载go-bingai-pass
      console.log('downloading go-bingai-pass.wasm');
      if (!existsSync('./go-bingai-pass.wasm')) {
        await new Downloader({
          url: 'https://github.com/Harry-zklcdc/go-bingai-pass/releases/latest/download/go-bingai-pass.wasm',
          directory: './',
          name: 'go-bingai-pass.wasm',
          cloneFiles: false,
          skipExistingFileName: true
        }).download();
        console.log('downloaded go-bingai-pass.wasm');
      } else {
        console.log('go-bingai-pass.wasm already exists');
      }
    }
  };
}