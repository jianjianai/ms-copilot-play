import { fCFF } from '../go-bingai-pass/worker';

export async function verify(request:Request):Promise<Response>{
    const cookie:string = request.headers.get('Cookie') || '';
    const currentUrl = new URL(request.url);
    const resData = await fCFF({
        'IG': currentUrl.searchParams.get('IG'),
        'iframeid': currentUrl.searchParams.get('iframeid'),
        'cookies': cookie,
        'convId': currentUrl.searchParams.get('convId'),
        'rid': currentUrl.searchParams.get('rid'),
        'T': currentUrl.searchParams.get('T'),
        'host': '',
    });
    const cookies = resData.result.cookies.split('; ');
    const newRes = Response.json(JSON.stringify(resData));
    for (let v of cookies) {
        newRes.headers.append('Set-Cookie', v + '; path=/');
    }
    return newRes;
};