export const bingPorxyWorker = async (req: Request,env:Env):Promise<Response>=>{
    // 开始请求
    const url = new URL(req.url);
    const headers = new Headers(req.headers);
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
    return await fetch(url,{...req,headers:headers}) as any;
}


