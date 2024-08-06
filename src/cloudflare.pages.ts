import { bingPorxyWorker } from "./proxy/bingPorxyWorker";

export async function onRequest(context:EventContext<Env,string,any>):Promise<Response>{
    const { request, env } = context;
    return bingPorxyWorker(request, env);
}