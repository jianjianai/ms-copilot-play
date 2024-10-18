import { session } from "electron";

export async function getLocalCookiesToRequestHeader(url: string) {
    const cookies = await session.defaultSession.cookies.get({ url: url });
    if (cookies.length > 0) {
        return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    }
    return undefined;
}

export async function setResponseHeadrCookiesToLocal(serCookies: string | string[] | undefined | null, url: string) {
    if (!serCookies) {
        return;
    }
    if (!Array.isArray(serCookies)) {
        serCookies = serCookies.split(',').map(cookie => cookie.trim());
    }
    for (const setCookie of serCookies) {
        const parsedCookie = parseSetCookieHeader(setCookie); // 解析 Set-Cookie 头部
        //parsedCookie.httpOnly = false; // 为了能够在浏览器中访问到 Cookie，需要将 httpOnly 设置为 false
        if (parsedCookie) {
            try {
                await session.defaultSession.cookies.set({ ...parsedCookie, url: url });  // 保存 Cookie
            } catch (e) {
                console.log(e, parsedCookie);
            }
        }
    }

    // 解析 'Set-Cookie' 头部 01-Jan-1970 08:00:00 GMT; path=/; secure; SameSite=None
    function parseSetCookieHeader(setCookieHeader: string) {
        const cookie: {
            name?: string;
            value?: string;
            domain?: string;
            path?: string;
            secure?: boolean;
            httpOnly?: boolean;
            expirationDate?: number;
        } = {};
        const parts = setCookieHeader.split(';');
        const firstEqualIndex = parts[0].indexOf('=');
        const name = parts[0].substring(0, firstEqualIndex).trim();
        const value = parts[0].substring(firstEqualIndex + 1).trim();
        cookie.name = name;
        cookie.value = value;
        for (const part of parts.slice(1)) {
            const equalIndex = part.indexOf('=');
            const key = equalIndex > -1 ? part.substring(0, equalIndex) : part;
            const val = equalIndex > -1 ? part.substring(equalIndex + 1) : '';
            const lowerKey = key.trim().toLowerCase();
            switch (lowerKey) {
                case 'expires':
                    cookie.expirationDate = new Date(val.trim()).getTime() / 1000;
                    break;
                case 'domain':
                    cookie.domain = val.trim();
                    break;
                case 'path':
                    cookie.path = val.trim();
                    break;
                case 'secure':
                    cookie.secure = true;
                    break;
                case 'httponly':
                    cookie.httpOnly = true;
                    break;
            }
        }
        return cookie;
    }
}