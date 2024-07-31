export type Cookies = {
		[key: string]: string;
}

export function parseCookies(cookies: string|undefined|null): Cookies {
	const ret: Cookies = {};
	if (!cookies) {
		return ret;
	}
	const cookieStrings = cookies.split(/; ?/);
	for (const cookieString of cookieStrings) {
		const i = cookieString.indexOf('=');
		ret[cookieString.substring(0, i)] = cookieString.substring(i + 1);
	}
	return ret;
}

export function serializeCookies(cookies: Cookies): string {
	return Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join("; ");
}

