declare module "*.html" {
    const content: string;
    export default content;
}

declare module "*.wasm" {
    const wasm: Promise<any>;
    export default wasm;
}