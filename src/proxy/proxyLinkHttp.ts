export type ReqHttpConfig = {url:string | URL, init:RequestInit};
export type ReqHttpTranslator = (config:ReqHttpConfig,req:Request)=> Promise<ReqHttpConfig>;
export type ResHttpConfig = {body:BodyInit|null,init:ResponseInit};
export type ReshttpTranslator = (config:ResHttpConfig,res:Response) => Promise<ResHttpConfig>;
export async function proxyLinkHttp(req:Request,reqTranslators:ReqHttpTranslator[],resTranslators:ReshttpTranslator[]){
    let reqConfig:ReqHttpConfig = {
        url:req.url,
        init:{
            method:req.method,
            headers:req.headers,
            body:req.body,
            redirect:"manual"
        }
    }
    for(const reqT of reqTranslators){
        reqConfig = await reqT(reqConfig,req);
    }
    if(req.url===reqConfig.url){
        return new Response("not curl",{status:400});
    }
    const res = await fetch(reqConfig.url,reqConfig.init);
    let resConfig:ResHttpConfig = {
        body:res.body as any,
        init:{
            status:res.status,
            headers:res.headers
        }
    }
    for (const resT of resTranslators) {
        resConfig = await resT(resConfig,res as any);
    }
    return new Response(resConfig.body,resConfig.init);
}