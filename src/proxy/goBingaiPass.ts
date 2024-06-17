async function  verifyPass(request:Request,bypassServer:string){
    const cookie: string = request.headers.get('Cookie') || '';
    const currentUrl = new URL(request.url);
    let req = {
        'IG': currentUrl.searchParams.get('IG'),
        'iframeid': currentUrl.searchParams.get('iframeid'),
        'cookies': cookie,
        'convId': currentUrl.searchParams.get('convId'),
        'rid': currentUrl.searchParams.get('rid'),
        'T': currentUrl.searchParams.get('T'),
        'host': currentUrl.hostname,
    }
    const newReq = new Request(bypassServer, {
        method: 'POST',
        body: JSON.stringify(req),
    });
    const res = await fetch(newReq)
    if (res.status != 200) {
        if (res.status === 451) {
            return Response.json({ code: 451, message: "Verification Failed", data: null }, { status: 451 })
        }
        return Response.json({ code: 500, message: "Server Error", data: null }, { status: res.status })
    }
    const resData = await res.json() as any;
    const cookies = resData.result.cookies.split('; ')
    const newRes = Response.json(JSON.stringify(resData));
    for (let v of cookies) {
        newRes.headers.append('Set-Cookie', v + '; path=/');
    }
    newRes.headers.append("BYPASS_SERVER","Remote");
    return newRes;
};

export async function verify(request: Request,evn:Env): Promise<Response> {
    if(evn.BYPASS_SERVER){
        return verifyPass(request,evn.BYPASS_SERVER);//使用远程服务器验证
    }
    return new Response("not set BYPASS_SERVER",{status:401});
};