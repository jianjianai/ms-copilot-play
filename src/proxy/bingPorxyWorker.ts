import indexHTML from '../html/index.html'
import fips from './usIps.json'

function getFIP():string{
    return fips[Math.floor(Math.random() * fips.length)][0];
}
/** CORS */
function handleOptions(request: Request) {
    const corsHeaders = {
        // 'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Origin': request.headers.get("Origin") || "",
        'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
        'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || '',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true'
    };
    return new Response(null, { headers: corsHeaders });
}

async function notPorxy(req: Request):Promise<Response|undefined>{
    const url = new URL(req.url);
    if(url.pathname=="/"){
        return new Response(
            indexHTML
                .replaceAll("${PHOST}",url.host)
                .replaceAll("${FIP}",getFIP()),
        {status:200,headers:{"content-type":"text/html; charset=utf-8"}});
    }
    return undefined;
}

export const bingPorxyWorker = async (req: Request,env:Env):Promise<Response>=>{
    // console.log(req.url);
    if(req.method=="OPTIONS"){
        return handleOptions(req);
    }
    // 开始请求
    const url = new URL(req.url);
    const headers = new Headers(req.headers);
    headers.delete("host");
    headers.delete("x-forwarded-host")
    const fip = headers.get("MCPXXX-FIP");
    headers.delete("MCPXXX-FIP");
    const toHost = headers.get("MCPXXX-TO-HOST");
    headers.delete("MCPXXX-TO-HOST");
    if(!fip){
        return await notPorxy(req) || new Response("no MCPXXX-FIP",{status:503});
    }
    if(!toHost){
        return await notPorxy(req) || new Response("no MCPXXX-TO-HOST",{status:503});
    }
    headers.set("X-forwarded-for",fip);
    url.host = toHost;
    return await fetch(url,{
        headers:headers,
        body:req.body,
        method:req.method
    }) as any;
}


