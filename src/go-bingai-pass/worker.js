import './wasm_exec.js'
import WASM from '../go-bingai-pass.wasm'

export const fCFF  = async (req) => {
  const go = new Go();

  
  const instance = await WebAssembly.instantiate(WASM, go.importObject);
  go.run(instance, {});

  let res = await new Promise((resolve, reject) => {
    let res = fuckCF(
      req.IG || '',
      req.cookies || '',
      req.iframeid || '',
      req.convId || '',
      req.rid || '',
      req.T || '',
      req.host || '',
      (result) => {
        resolve(result)
      }
    )
    if (res != '' && res != null && res != undefined) {
      reject(res)
    }
  })
  res = JSON.parse(res)
  return {
    result: {
      cookies: res.cookies,
    },
    error: res.err
  }
}

export const getTokenRequest = async () => {
  const go = new Go();

  const instance = await WebAssembly.instantiate(WASM, go.importObject);
  go.run(instance, {});

  let res = await new Promise((resolve) => {
    let res = getToken()
    resolve(res)
  })
  return res;
};