export type ReqHttpConfig = { url: URL, init: RequestInit };
export type ReqHttpTranslator<ENV> = (config: ReqHttpConfig, req: Request,env:ENV) => Promise<ReqHttpConfig>;
export type ResHttpConfig = { body: BodyInit | null, init: ResponseInit };
export type ReshttpTranslator<ENV> = (config: ResHttpConfig, res: Response , req: Request,env:ENV) => Promise<ResHttpConfig>;
export type Intercept<ENV> = (req: Request,env:ENV) => Promise<Response | null>;

export type NewProxyLinkHttpConfig<ENV> = {
    /**
     * 拦截请求
     */
    intercept: Intercept<ENV>, 
    /**
     * 请求编辑
     */
    reqTranslator: ReqHttpTranslator<ENV>, 
    /**
     * 响应编辑
     */
    resTranslator: ReshttpTranslator<ENV>
}

export function newProxyLinkHttp<ENV>({intercept,reqTranslator,resTranslator}:NewProxyLinkHttpConfig<ENV>) {
    return async function(req: Request,env:ENV):Promise<Response> {
        const interceptRes = await intercept(req,env);
        if (interceptRes) {
            return interceptRes;
        }
        const reqConfig = await reqTranslator({
            url: new URL(req.url),
            init: {
                method: req.method,
                headers: req.headers,
                body: req.body,
                redirect: "manual"
            }
        }, req,env);
        
        if (reqConfig.url.hostname == new URL(req.url).hostname) {
            return new Response("Same hostname", { status: 404 });
        }
        const res = await fetch(reqConfig.url, reqConfig.init);
        const resConfig  = await resTranslator({
            body: res.body as any,
            init: {
                status: res.status,
                headers: res.headers
            }
        }, res as any,req,env);
        return new Response(resConfig.body, resConfig.init);
    }
}