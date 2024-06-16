declare module "*.html" {
    const content: string;
    export default content;
}

declare module "*.wasm" {
    const wasm: (imports?:Imports)=>Promise<WebAssembly.Module>;
    export default wasm;
}