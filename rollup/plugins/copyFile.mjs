import { Downloader } from 'nodejs-file-downloader';
import { copyFileSync,mkdirSync } from 'fs';
import { dirname } from 'path';

/** @returns {import('rollup').Plugin} */
export default function copyFile(from, to) {
  return {
    name: 'copyFile',
    buildEnd: async () => {
      console.log(`copying ${from} to ${to}`);
      mkdirSync(dirname(to),{recursive:true});
      copyFileSync(from, to);
      console.log(`copied ${from} to ${to}`);
    }
  };
}