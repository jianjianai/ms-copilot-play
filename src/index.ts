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

const XForwardedForIP = `104.28.${Math.floor(150+Math.random()*50)}.${Math.floor(20+Math.random()*200)}`;
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
			//copilot的请求
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(
					p!="/" && 
					!p.startsWith("/rp/") && 
					!p.startsWith("/fd/") &&
					!p.startsWith("/rewardsapp/") &&
					!p.startsWith("/notifications/") && 
					!p.startsWith("/sa/") &&
					!p.startsWith("/rs/") &&
					!p.startsWith("/sharing/") &&
					!p.startsWith("/sydchat/") &&
					!p.startsWith("/turing/") &&
					!p.startsWith("/th") &&
					!p.startsWith("/Identity/") &&
					!p.startsWith("/hamburger/") &&
					!p.startsWith("/secure/") &&
					p!="/bingufsync" &&
					p!="/passport.aspx"
				){
					return config;
				}
				url.hostname = "copilot.microsoft.com"
				return config;
			},
			// login请求
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(
					p!="/GetCredentialType.srf" &&
					!p.startsWith("/ppsecure/") &&
					p!="/login.srf" &&
					p!="/GetOneTimeCode.srf" &&
					p!="/GetSessionState.srf" &&
					p!="/GetExperimentAssignments.srf" &&
					p!="/logout.srf"
				){
					return config;
				}
				url.hostname = "login.live.com"
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
					resHeaders.set('Origin',originUrl.toString());
				}
				return config;
			},
			// Referer 设置
			async (config)=>{
				const resHeaders = config.init.headers as Headers;
				const referer = resHeaders.get('Referer');
				if(referer){
					const url = config.url as URL;
					const refererUrl = new URL(referer);
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
					resHeaders.set('Referer',refererUrl.toString());
				}
				return config;
			},
			// 修改登录请求 /secure/Passport.aspx 
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(p!="/secure/Passport.aspx" && p!="/passport.aspx"){
					return config;
				}
				url.searchParams.set("requrl","https://copilot.microsoft.com/?wlsso=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1");
				return config;
			},
			// 修改登录请求
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(p!="/fd/auth/signin"){
					return config;
				}
				url.searchParams.set("return_url","https://copilot.microsoft.com/?wlsso=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1");
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
				if (!res.headers.get("Content-Type")?.startsWith("text/")) {
					return config;
				}
				resHeaders.delete("Content-Md5");
				let retBody = await res.text();
				retBody = retBody.replace(/https?:\/\/sydney\.bing\.com(:[0-9]{1,6})?/g, `${porxyOrigin}`);
				retBody = retBody.replace(/https?:\/\/login\.live\.com(:[0-9]{1,6})?/g, `${porxyOrigin}`);
				retBody = retBody.replace(/https?:\/\/copilot\.microsoft\.com(:[0-9]{1,6})?/g, `${porxyOrigin}`);
				// retBody = retBody.replace(/https?:\\\/\\\/copilot\.microsoft\.com(:[0-9]{1,6})?/g, `${porxyOrigin.replaceAll("/",`\\/`)}`);
				// retBody = retBody.replaceAll(`"copilot.microsoft.com"`,`"${porxyHostName}"`);
				// retBody = retBody.replaceAll(`"copilot.microsoft.com/"`,`"${porxyHostName}/"`);
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

