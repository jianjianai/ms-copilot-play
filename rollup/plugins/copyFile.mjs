import { Downloader } from 'nodejs-file-downloader';
import { copyFileSync } from 'fs';

/** @returns {import('rollup').Plugin} */
export default function copyFile(from, to) {
  return {
    name: 'copyFile',
    buildEnd: async () => {
      console.log(`copying ${from} to ${to}`);
      copyFileSync(from, to);
      console.log(`copied ${from} to ${to}`);
    }
  };
}