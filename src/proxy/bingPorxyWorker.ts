/** CORS */
function handleOptions(request: Request) {
    return new Response(null);
}

export const bingPorxyWorker = async (req: Request,env:Env):Promise<Response>=>{
    console.log(req.url);
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
        return new Response("no MCPXXX-FIP",{status:503});
    }
    if(!toHost){
        return new Response("no MCPXXX-TO-HOST",{status:503});
    }
    headers.set("X-forwarded-for",fip);
    url.host = toHost;
    return await fetch(url,{
        headers:headers,
        body:req.body,
        method:req.method
    }) as any;
}


