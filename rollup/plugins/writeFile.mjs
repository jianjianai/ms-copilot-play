import { Downloader } from 'nodejs-file-downloader';
import { writeFileSync,mkdirSync } from 'fs'
import { dirname } from 'path';

/** @returns {import('rollup').Plugin} */
export default function writeFile(path, content) {
  return {
    name: 'writeFile',
    buildEnd: async () => {
      console.log(`writing ${path}`);
      mkdirSync(dirname(path),{recursive:true});
      writeFileSync(path, content);
      console.log(`wrote ${path}`);
    }
  };
}