/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { proxyLinkHttp } from "./proxyLink/proxyLinkHttp";
import { usIps } from './ips/usIps';
import CopilotInjection from './html/CopilotInjection.html';
import CFTuring from './html/CFTuring.html';
import CFTNormalUring from './html/CFTNormalUring.html';
import MusicInJection from './html/MusicInJection.html';
import ImagesCreateInJection from './html/ImagesCreateInJection.html';
import LoginInJectionBody from './html/LoginInJectionBody.html';

const XForwardedForIP = usIps[Math.floor(Math.random()*usIps.length)][0];
console.log(XForwardedForIP)
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const upgradeHeader = request.headers.get('Upgrade');
		if (upgradeHeader && upgradeHeader == 'websocket') {
			return websocketPorxy(request);
		}
		const url = new URL(request.url);
		const porxyHostName = url.hostname; //域名
		const porxyOrigin = url.origin;
		const porxyPort = url.port;
		const porxyProtocol = url.protocol;
		return proxyLinkHttp(request,[
			//基础转换
			async (config)=>{
				const url = new URL(config.url);
				url.port = ""
				url.protocol = 'https:';
				config.url = url;
				config.init.headers = new Headers(config.init.headers);
				return config;
			},
			//请求重定向
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				//sydney的请求
				if(p.startsWith("/sydney/")){
					url.hostname = "sydney.bing.com";//设置链接
				}
				//copilot的请求
				if(
					p=="/" || 
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
					p=="/bingufsync" ||
					p=="/passport.aspx" ||
					p.startsWith("/images/") ||
					p.startsWith("/idp/") ||
					p.startsWith("/cdx/") ||
					p.startsWith("/pwa/") ||
					p.startsWith("/videos/")
				){
					url.hostname = "copilot.microsoft.com"
				}
				// login请求
				if(
					p=="/GetCredentialType.srf" ||
					p.startsWith("/ppsecure/") ||
					p=="/login.srf" ||
					p=="/GetOneTimeCode.srf" ||
					p=="/GetSessionState.srf" ||
					p=="/GetExperimentAssignments.srf" ||
					p=="/logout.srf"
				){
					url.hostname = "login.live.com"
				}
				//storage请求
				if(p.startsWith("/users/")){
					url.hostname = "storage.live.com"
				}
				//challenges.cloudflare.com
				if(p.startsWith("/turnstile/") || p.startsWith("/pocybig/")){
					url.hostname = "challenges.cloudflare.com"
					url.pathname = url.pathname.replace("/pocybig/","/cdn-cgi/");
				}
				return config;
			},
			// XForwardedForIP 设置
			async (config)=>{
				const resHeaders = config.init.headers as Headers;
				resHeaders.set("X-forwarded-for", XForwardedForIP);
				return config;
			},
			// origin 设置
			async (config)=>{
				const resHeaders = config.init.headers as Headers;
				const origin = resHeaders.get('Origin');
				if(origin){
					const url = config.url as URL;
					const originUrl = new URL(origin);
					originUrl.protocol = "https:";
					originUrl.port = '';
					originUrl.hostname =  "copilot.microsoft.com"
					if(
						url.pathname=="/GetCredentialType.srf" ||
						url.pathname.startsWith("/ppsecure/") ||
						url.pathname=="/GetExperimentAssignments.srf" ||
						url.pathname=="/secure/Passport.aspx"
					){
						originUrl.hostname = "login.live.com"
					}
					if(
						url.pathname.startsWith("/pocybig/")
					){
						originUrl.hostname = "www.bing.com"
						// originUrl.pathname = originUrl.pathname.replace("/pocybig/","/cdn-cgi/");
					}
					resHeaders.set('Origin',originUrl.origin);
				}
				return config;
			},
			// Referer 设置
			async (config)=>{
				const resHeaders = config.init.headers as Headers;
				const referer = resHeaders.get('Referer');
				if(referer){
					const url = config.url as URL;
					let refererUrl:URL|string = new URL(referer);
					refererUrl.protocol = "https:";
					refererUrl.port = '';
					refererUrl.hostname =  "copilot.microsoft.com"
					if(
						url.pathname=="/secure/Passport.aspx" || 
						url.pathname.startsWith("/ppsecure/") ||
						url.pathname=="/GetExperimentAssignments.srf" ||
						url.pathname=="/GetCredentialType.srf"
					){
						refererUrl.hostname =  "login.live.com"
					}
					if(
						url.pathname.startsWith("/pocybig/")
					){
						refererUrl.hostname = "challenges.cloudflare.com"
						refererUrl.pathname = refererUrl.pathname.replace("/pocybig/","/cdn-cgi/");
						if(url.pathname.endsWith("/normal")){//TODO 可能也许需要
							refererUrl = "https://www.bing.com/";
						}
					}
					resHeaders.set('Referer',refererUrl.toString());
				}
				return config;
			},
			// 修改登录请求 /secure/Passport.aspx 
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(p=="/secure/Passport.aspx" || p=="/passport.aspx"){
					let requrl = url.searchParams.get("requrl");
					if(requrl){
						url.searchParams.set("requrl",requrl.replace(porxyOrigin,"https://copilot.microsoft.com"));
					}
				}
				if(p=="/fd/auth/signin"){
					let requrl = url.searchParams.get("return_url");
					if(requrl){
						url.searchParams.set("return_url",requrl.replace(porxyOrigin,"https://copilot.microsoft.com"));
					}
				}
				if(p=="/Identity/Dropdown"){
					let requrl = url.searchParams.get("ru");
					if(requrl){
						url.searchParams.set("ru",requrl.replace(porxyOrigin,"https://copilot.microsoft.com"));
					}
				}
				if(p=="/login.srf"){
					let requrl = url.searchParams.get("wreply");
					if(requrl){
						url.searchParams.set("wreply",requrl.replace(porxyOrigin,"https://copilot.microsoft.com"));
					}
				}
				return config;
			},
			// 修改更新会话请求
			async (config,req)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(p=="/sydney/UpdateConversation"){
					//修改请求内容
					let bodyjson = await req.text();
					bodyjson = bodyjson.replaceAll(porxyOrigin,"https://copilot.microsoft.com");
					config.init.body = bodyjson;
				}
				return config;
			},
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(p!="/fd/ls/l"){
					return config;
				}
				let sdata = url.searchParams.get("DATA");
				if(sdata){
					sdata = sdata.replaceAll(porxyOrigin,"https://copilot.microsoft.com");
					url.searchParams.set("DATA",sdata);
				}
				return config;
			},
			//不同域重定向转换
			async (config)=>{
				const url = config.url as URL;
				if(url.searchParams.has("cprt")){
					url.hostname = url.searchParams.get("cprt") as string;
					url.searchParams.delete("cprt");
					return config;
				}
				if(url.searchParams.has("cprtp")){
					url.port = url.searchParams.get("cprtp") as string;
					url.searchParams.delete("cprtp");

				}
				if(url.searchParams.has("cprtl")){
					url.protocol = url.searchParams.get("cprtl") as string;
					url.searchParams.delete("cprtl");
				}
				return config;
			}

		],[
			//基本转换
			async (config)=>{
				config.init.headers = new Headers(config.init.headers);
				return config;
			},
			//set-cookie转换
			async (config)=>{
				const resHeaders = config.init.headers as Headers;
				const newheaders = new Headers();
				for (const headerPer of resHeaders) {
					const key = headerPer[0];
					let value = headerPer[1];
					if (key.toLocaleLowerCase() == 'set-cookie') {
						value = value.replace(/[Dd]omain=\.?[0-9a-z]*\.?microsoft\.com/, `Domain=.${porxyHostName}`);
						value = value.replace(/[Dd]omain=\.?[0-9a-z]*\.?live\.com/, `Domain=.${porxyHostName}`);
						value = value.replace(/[Dd]omain=\.?[0-9a-z]*\.?bing\.com/, `Domain=.${porxyHostName}`);
					}
					newheaders.append(key, value);
				}
				config.init.headers = newheaders;
				return config;
			},
			//txt文本域名替换
			async (config,res)=>{
				const resHeaders = config.init.headers as Headers;
				const contentType = res.headers.get("Content-Type");
				if (!contentType || (!contentType.startsWith("text/") && !contentType.startsWith("application/javascript") && !contentType.startsWith("application/json"))) {
					return config;
				}
				resHeaders.delete("Content-Md5");
				let retBody = await res.text();
				const resUrl = new URL(res.url);

				if(
					!resUrl.pathname.startsWith("/turing/") && 
					!resUrl.pathname.startsWith("/turnstile/") &&
					!resUrl.pathname.startsWith("/cdn-cgi/")
				){
					retBody = retBody.replace(/https?:\/\/sydney\.bing\.com(:[0-9]{1,6})?/g, `${porxyOrigin}`);
					retBody = retBody.replace(/https?:\/\/login\.live\.com(:[0-9]{1,6})?/g, `${porxyOrigin}`);
					retBody = retBody.replace(/https?:\/\/copilot\.microsoft\.com(:[0-9]{1,6})?/g, `${porxyOrigin}`);
					retBody = retBody.replace(/https?:\/\/www\.bing\.com(:[0-9]{1,6})?/g,`${porxyOrigin}`);
					retBody = retBody.replace(/https?:\/\/storage\.live\.com(:[0-9]{1,6})?/g, `${porxyOrigin}`);
				}

				//特定页面注入脚本
				if(resUrl.pathname=="/"){
					retBody = injectionHtmlToHead(retBody,CopilotInjection);
				}
				//验证页面转换
				if(resUrl.pathname=="/turing/captcha/challenge"){
					retBody = retBody.replaceAll("https://challenges.cloudflare.com",`${porxyOrigin}`);
					retBody = injectionHtmlToHead(retBody,CFTuring);
				}
				//音乐页面脚本注入
				if(resUrl.pathname=="/videos/music"){
					retBody = injectionHtmlToHead(retBody,MusicInJection);
				}
				//图片生成注入
				if(
					resUrl.pathname=="/images/create" || 
					(resUrl.pathname.startsWith("/images/create/") && !resUrl.pathname.startsWith("/images/create/async/"))
				){
					retBody = injectionHtmlToHead(retBody,ImagesCreateInJection);
				}
				//验证脚本转换
				if(resUrl.pathname.startsWith("/turnstile/") && resUrl.pathname.endsWith("/api.js")){
					retBody = retBody.replaceAll("https://challenges.cloudflare.com",`${porxyOrigin}`)
					retBody = retBody.replaceAll("/cdn-cgi/","/pocybig/");
					retBody = retBody.replaceAll("location","myCFLocation");
				}
				if(resUrl.pathname.startsWith("/cdn-cgi/challenge-platform/")){
					retBody = retBody.replaceAll("/cdn-cgi/","/pocybig/");
					if(resUrl.pathname.endsWith("/normal")){
						retBody = injectionHtmlToHead(retBody,CFTNormalUring);
					}
				}
				if(resUrl.pathname=="/login.srf"){
					retBody = injectionHtmlToBody(retBody,LoginInJectionBody);
				}
				config.body = retBody;
				return config;
			},
			//重定向转换
			async (config,res)=>{
				if(res.status<300 || res.status>=400){
					return config;
				}
				const resHeaders = config.init.headers as Headers;
				const loto = resHeaders.get("Location");
				if(!loto){
					return config;
				}
				if(!loto.toLowerCase().startsWith("http")){
					return config;
				}
				const lotoUrl = new URL(loto);
				lotoUrl.hostname = porxyHostName;
				lotoUrl.port = porxyPort;
				lotoUrl.protocol = porxyProtocol;
				resHeaders.set("Location",lotoUrl.toString());
				return config;
			}
		]);
	},
};


async function websocketPorxy(request: Request): Promise<Response> {
	const reqUrl = new URL(request.url);
	reqUrl.hostname = 'sydney.bing.com';
	reqUrl.protocol = 'https:';
	reqUrl.port = '';
	const headers = new Headers(request.headers);
	if(headers.get("origin")){
		headers.set("origin","https://copilot.microsoft.com")
	}
	headers.append("X-forwarded-for", XForwardedForIP);
	return fetch(reqUrl, { 
		body: request.body, 
		headers: headers,
		method: request.method
	}) as any;
}

/** 注入到head */
function injectionHtmlToHead(html:string,sc:string){
    return html.replace("<head>",`<head>${sc}`)
}

/** 注入到body */
function injectionHtmlToBody(html:string,sc:string){
    return html.replace("<body>",`<body>${sc}`)
}

