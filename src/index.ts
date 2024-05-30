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

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const upgradeHeader = request.headers.get('Upgrade');
		if (!upgradeHeader || upgradeHeader !== 'websocket') {
			return httpPorxy(request);
		}
		return websocketPorxy(request);
	},
};

async function websocketPorxy(request: Request): Promise<Response> {
	const reqUrl = new URL(request.url);
	reqUrl.hostname = 'sydney.bing.com';
	reqUrl.protocol = 'https:';
	reqUrl.port = '';
	const headers = requestHeaderConversion(request.headers);
	return fetch(reqUrl, { 
		body: request.body, 
		headers: headers,
		method: request.method
	}) as any;
}

async function httpPorxy(request: Request): Promise<Response> {
	const reqUrl = new URL(request.url);
	reqUrl.hostname = 'copilot.microsoft.com';
	reqUrl.protocol = 'https:';
	reqUrl.port = '';
	const res = await fetch(reqUrl, {
		method: request.method,
		headers: requestHeaderConversion(request.headers),
		body: request.body
	})
	return responseConversion(request, res as any);
}

async function responseConversion(request: Request, res: Response): Promise<Response> {
	const reqUrl = new URL(request.url);
	const resHeaders = responseHeaderConversion(request, res.headers as Headers);
	if (res.headers.get("Content-Type")?.startsWith("text/")) {
		resHeaders.delete("Content-Md5");
		let retBody = await res.text();
		retBody = retBody.replace(/https?:\/\/sydney\.bing\.com/g, `${reqUrl.origin}/`);
		return new Response(retBody, { headers: resHeaders, status: res.status });
	}
	return new Response(res.body as any, { headers: resHeaders, status: res.status });
}

function responseHeaderConversion(request: Request, resHeaders: Headers): Headers {
	const reqUrl = new URL(request.url);
	const headers = new Headers();
	for (const headerPer of resHeaders) {
		const key = headerPer[0];
		let value = headerPer[1];
		if (key.toLocaleLowerCase() == 'set-cookie') {
			value = value.replace(/Domain=\..*\.?microsoft\.com;/, `Domain=.${reqUrl.hostname};`)
		}
		headers.append(key, value);
	}
	return headers;
}

const XForwardedForIP = `104.28.${Math.floor(20+Math.random()*200)}.${Math.floor(20+Math.random()*200)}`
function requestHeaderConversion(requestHeader: Headers): Headers {
	const headers = new Headers();
	for (const headerPer of requestHeader) {
		const key = headerPer[0];
		let value = headerPer[1];
		if (key.toLocaleLowerCase() == 'origin') {
			value = "https://copilot.microsoft.com";
		}
		headers.append(key, value);
	}
	headers.append("X-forwarded-for", XForwardedForIP);
	return headers;
}

