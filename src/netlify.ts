import { bingPorxyWorker } from "./proxy/bingPorxyWorker";

export default (request: Request)=>{
    return bingPorxyWorker(request, process.env as any);
}