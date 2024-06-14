import { porxyWorker } from "./proxy/porxyWorker";

export async function onRequest(context:EventContext<Env,string,any>):Promise<Response>{
    const { request, env } = context;
    return porxyWorker(request, env);
}