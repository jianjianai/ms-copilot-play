import { newProxyLinkHttp } from "./proxyLinkHttp";
import usIps from '../ips/usIps.json';
import CopilotInjection from '../html/CopilotInjection.html';
import MusicInJection from '../html/MusicInJection.html';
import ImagesCreateInJection from '../html/ImagesCreateInJection.html';
import LoginInJectionBody from '../html/LoginInJectionBody.html';
import { verify } from './goBingaiPass';
import ChallengeResponseBody from '../html/ChallengeResponseBody.html'




/** websocket */
async function websocketPorxy(request: Request): Promise<Response> {
    const reqUrl = new URL(request.url);
    reqUrl.hostname = 'sydney.bing.com';
    reqUrl.protocol = 'https:';
    reqUrl.port = '';
    const headers = new Headers(request.headers);
    if (headers.get("origin")) {
        headers.set("origin", "https://copilot.microsoft.com")
    }
    headers.append("X-forwarded-for", XForwardedForIP);
    return fetch(reqUrl, {
        body: request.body,
        headers: headers,
        method: request.method
    }) as any;
}

/** CORS */
function handleOptions(request: Request) {
    let url = new URL(request.url);
    const corsHeaders = {
        // 'Access-Control-Allow-Origin': *,
        'Access-Control-Allow-Origin': url.origin,
        'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
        'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || '',
        'Access-Control-Max-Age': '86400',
    };
    return new Response(null, { headers: corsHeaders });
}

/** 注入到head */
function injectionHtmlToHead(html: string, sc: string) {
    return html.replace("<head>", `<head>${sc}`)
}

/** 注入到body */
function injectionHtmlToBody(html: string, sc: string) {
    return html.replace("<body>", `<body>${sc}`)
}

const bingProxyLink = newProxyLinkHttp<Env>({
    async intercept(req, env) {//拦截
        // 处理 websocket
        const upgradeHeader = req.headers.get('Upgrade');
        if (upgradeHeader && upgradeHeader == 'websocket') {
            return websocketPorxy(req);
        }
        // 处理 CORS 请求
        if (req.method === 'OPTIONS') {
            return handleOptions(req);
        }
        //验证
        const reqUrl = new URL(req.url);
        if (reqUrl.pathname == "/challenge/verify") {
            return verify(req,env);
        }
        //客户端请求验证接口
        if(reqUrl.pathname == '/turing/captcha/challenge' && (!reqUrl.searchParams.has('h'))){
            return new Response(ChallengeResponseBody,{
                headers:{
                    'Content-Type':"text/html; charset=utf-8"
                }
            });
        }
        return null;
    },
    async reqTranslator(config, req, env) {//修改请求
        {   //基础转换
            config.url.port = ""
            config.url.protocol = 'https:';
            config.init.headers = new Headers(config.init.headers);
        }

        {//重定向请求
            const p = config.url.pathname;
            //sydney的请求
            if (p.startsWith("/sydney/")) {
                config.url.hostname = "sydney.bing.com";//设置链接
            }
            //copilot的请求
            if (
                p == "/" ||
                p.startsWith("/rp/") ||
                p.startsWith("/fd/") ||
                p.startsWith("/rewardsapp/") ||
                p.startsWith("/notifications/") ||
                p.startsWith("/sa/") ||
                p.startsWith("/rs/") ||
                p.startsWith("/sharing/") ||
                p.startsWith("/sydchat/") ||
                p.startsWith("/turing/") ||
                p.startsWith("/th") ||
                p.startsWith("/Identity/") ||
                p.startsWith("/hamburger/") ||
                p.startsWith("/secure/") ||
                p == "/bingufsync" ||
                p == "/passport.aspx" ||
                p.startsWith("/images/") ||
                p.startsWith("/idp/") ||
                p.startsWith("/cdx/") ||
                p.startsWith("/pwa/") ||
                p.startsWith("/videos/")
            ) {
                config.url.hostname = "copilot.microsoft.com"
            }
            // bing请求
            if (p.startsWith("/opaluqu/")) {
                config.url.hostname = "www.bing.com"
            }
            // login请求
            if (
                p == "/GetCredentialType.srf" ||
                p.startsWith("/ppsecure/") ||
                p == "/login.srf" ||
                p == "/GetOneTimeCode.srf" ||
                p == "/GetSessionState.srf" ||
                p == "/GetExperimentAssignments.srf" ||
                p == "/logout.srf"
            ) {
                config.url.hostname = "login.live.com"
            }
            // login account请求
            if(
                p.startsWith("/proofs/") || 
                p=="/SummaryPage.aspx"
            ){
                config.url.hostname = "account.live.com"
            }
            //storage请求
            if (p.startsWith("/users/") ) {
                config.url.hostname = "storage.live.com"
            }
            //bing验证请求
            if(p=='/turing/captcha/challenge'){
                config.url.hostname = "www.bing.com";
                config.url.searchParams.delete('h');
            }
        }

        // XForwardedForIP 设置
        if(env.XForwardedForIP){
            (config.init.headers as Headers).set("X-forwarded-for", env.XForwardedForIP);
        }

        {// origin 设置
            const resHeaders = config.init.headers as Headers;
            const origin = resHeaders.get('Origin');
            if (origin) {
                const url = config.url;
                const originUrl = new URL(origin);
                originUrl.protocol = "https:";
                originUrl.port = '';
                originUrl.hostname = "copilot.microsoft.com"
                if (
                    url.pathname == "/GetCredentialType.srf" ||
                    url.pathname.startsWith("/ppsecure/") ||
                    url.pathname == "/GetExperimentAssignments.srf" ||
                    url.pathname == "/secure/Passport.aspx"
                ) {
                    originUrl.hostname = "login.live.com"
                }
                resHeaders.set('Origin', originUrl.origin);
            }
        }

        {// Referer 设置
            const resHeaders = config.init.headers as Headers;
            const referer = resHeaders.get('Referer');
            if (referer) {
                const url = config.url as URL;
                let refererUrl: URL | string = new URL(referer);
                refererUrl.protocol = "https:";
                refererUrl.port = '';
                refererUrl.hostname = "copilot.microsoft.com"
                if (
                    url.pathname == "/secure/Passport.aspx" ||
                    url.pathname.startsWith("/ppsecure/") ||
                    url.pathname == "/GetExperimentAssignments.srf" ||
                    url.pathname == "/GetCredentialType.srf"
                ) {
                    refererUrl.hostname = "login.live.com"
                }
                resHeaders.set('Referer', refererUrl.toString());
            }
        }

        {//修改登录请求 /secure/Passport.aspx 
            const url = config.url;
            const p = url.pathname;
            const porxyOrigin = new URL(req.url).origin;
            if (p == "/secure/Passport.aspx" || p == "/passport.aspx") {
                let requrl = url.searchParams.get("requrl");
                if (requrl) {
                    url.searchParams.set("requrl", requrl.replace(porxyOrigin, "https://copilot.microsoft.com"));
                }
            }
            if (p == "/fd/auth/signin") {
                let requrl = url.searchParams.get("return_url");
                if (requrl) {
                    url.searchParams.set("return_url", requrl.replace(porxyOrigin, "https://copilot.microsoft.com"));
                }
            }
            if (p == "/Identity/Dropdown" || p == "/Identity/Hamburger" || p=="/proofs/Add") {
                let requrl = url.searchParams.get("ru");
                if (requrl) {
                    url.searchParams.set("ru", requrl.replace(porxyOrigin, "https://copilot.microsoft.com"));
                }
            }
            if (p == "/login.srf") {
                let requrl = url.searchParams.get("wreply");
                if (requrl) {
                    url.searchParams.set("wreply", requrl.replace(porxyOrigin, "https://copilot.microsoft.com"));
                }
            }
            // 修改更新会话请求
            if (p == "/sydney/UpdateConversation") {
                //修改请求内容
                let bodyjson = await req.text();
                bodyjson = bodyjson.replaceAll(porxyOrigin, "https://copilot.microsoft.com");
                config.init.body = bodyjson;
            }
            // 修改统计请求内容
            if (p == "/fd/ls/l") {
                let sdata = url.searchParams.get("DATA");
                if (sdata) {
                    sdata = sdata.replaceAll(porxyOrigin, "https://copilot.microsoft.com");
                    url.searchParams.set("DATA", sdata);
                }
            }
        }

        {//不同域重定向转换
            const url = config.url;
            if (url.searchParams.has("cprt")) { //cprt -> hostname
                url.hostname = url.searchParams.get("cprt") as string;
                url.searchParams.delete("cprt");
            } else {
                if (url.searchParams.has("cprtp")) { //cprtp -> port
                    url.port = url.searchParams.get("cprtp") as string;
                    url.searchParams.delete("cprtp");

                }
                if (url.searchParams.has("cprtl")) {//cprtl -> protocol
                    url.protocol = url.searchParams.get("cprtl") as string;
                    url.searchParams.delete("cprtl");
                }
            }
        }
        return config;
    },
    async resTranslator(config, res, req, env) {//修改返回
        const reqUrl = new URL(req.url);
        //基本转换
        config.init.headers = new Headers(config.init.headers);

        {//set-cookie转换
            const newheaders = new Headers();
            for (const headerPer of config.init.headers as Headers) {
                const key = headerPer[0];
                let value = headerPer[1];
                if (key.toLocaleLowerCase() == 'set-cookie') {
                    value = value.replace(/[Dd]omain=\.?[0-9a-z]*\.?microsoft\.com/, `Domain=.${reqUrl.hostname}`);
                    value = value.replace(/[Dd]omain=\.?[0-9a-z]*\.?live\.com/, `Domain=.${reqUrl.hostname}`);
                    value = value.replace(/[Dd]omain=\.?[0-9a-z]*\.?bing\.com/, `Domain=.${reqUrl.hostname}`);
                }
                newheaders.append(key, value);
            }
            config.init.headers = newheaders;
        }

         {//txt文本替换
            const resUrl = new URL(res.url);
            const resHeaders = config.init.headers as Headers;
            const contentType = res.headers.get("Content-Type");
            
            if( resUrl.pathname!="/turing/captcha/challenge" && // 这个路径是验证接口，不进行处理
                contentType && 
                (
                    contentType.startsWith("text/") || 
                    contentType.startsWith("application/javascript") ||
                    contentType.startsWith("application/json")
                )
            ){
                resHeaders.delete("Content-Md5");
                let retBody = await res.text();

                retBody = retBody.replace(/https?:\/\/sydney\.bing\.com(:[0-9]{1,6})?/g, `${reqUrl.origin}`);
                retBody = retBody.replace(/https?:\/\/login\.live\.com(:[0-9]{1,6})?/g, `${reqUrl.origin}`);
                retBody = retBody.replace(/https?:\/\/account\.live\.com(:[0-9]{1,6})?/g, `${reqUrl.origin}`);
                retBody = retBody.replace(/https?:\/\/copilot\.microsoft\.com(:[0-9]{1,6})?/g, `${reqUrl.origin}`);
                retBody = retBody.replace(/https?:\/\/www\.bing\.com(:[0-9]{1,6})?/g, `${reqUrl.origin}`);
                retBody = retBody.replace(/https?:\/\/storage\.live\.com(:[0-9]{1,6})?/g, `${reqUrl.origin}`);
    
                //特定页面注入脚本
                if (resUrl.pathname == "/") {
                    retBody = injectionHtmlToHead(retBody, CopilotInjection);
                }
                //音乐页面脚本注入
                if (resUrl.pathname == "/videos/music") {
                    retBody = injectionHtmlToHead(retBody, MusicInJection);
                }
                //图片生成注入
                if (
                    resUrl.pathname == "/images/create" ||
                    (resUrl.pathname.startsWith("/images/create/") && !resUrl.pathname.startsWith("/images/create/async/"))
                ) {
                    retBody = injectionHtmlToHead(retBody, ImagesCreateInJection);
                }
                if (resUrl.pathname == "/login.srf") {
                    retBody = injectionHtmlToBody(retBody, LoginInJectionBody);
                }
                config.body = retBody;
            }
        }

        //重定向转换
        if (res.status >= 300 && res.status < 400) {
            const resHeaders = config.init.headers as Headers;
            const loto = resHeaders.get("Location");
            if (loto && loto.toLowerCase().startsWith("http")) {
                const lotoUrl = new URL(loto);
                lotoUrl.hostname = reqUrl.hostname;
                lotoUrl.port = reqUrl.port;
                lotoUrl.protocol = reqUrl.protocol;
                resHeaders.set("Location", lotoUrl.toString());
            }
        }
        return config;
    }
});

const XForwardedForIP = usIps[Math.floor(Math.random() * usIps.length)][0];
export const bingPorxyWorker = (req: Request,env:Env)=>{
    // 初始化 环境变量
    env.XForwardedForIP = env.XForwardedForIP || XForwardedForIP;
    // 开始请求
    return bingProxyLink(req,env);
}


