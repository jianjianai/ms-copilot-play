import { fCFF } from '../go-bingai-pass/worker';

(() => {
    async function verifyFCFF(IG,iframeid,convId,rid,T){
        const resData = await fCFF({
            'IG': IG,
            'iframeid': iframeid,
            'cookies': document.cookie,
            'convId': convId,
            'rid': rid,
            'T': T,
            'host': location.hostname,
        });
        const cookies = resData.result.cookies.split('; ');
        for (let ck of cookies) {
            const i = ck.indexOf("=");
            if(i>=0){
                const k = ck.substring(0,i);
                const v = ck.substring(i+1);
                await cookieStore.set(k,v);
            }
        }
        console.log("verifyFCFF",JSON.stringify(resData));
        return resData;
    }
    const verify = async () => {
        const IG = window.parent._G.IG;
        const convId = window.parent.CIB.manager.conversation.id;
        const rid = window.parent.CIB.manager.conversation.messages[0].requestId;
        const iframeid = new URL(window.location.href).searchParams.get('iframeid');
        const TA = 'Harry-zklcdc/go-proxy-bingai';//Harry-zklcdc这是验证通过的功能作者哦，本项目和go-proxy-bingai使用的相同的验证通过技术Harry-zklcdc/go-bingai-pass。
        const T = await window.parent.aesEncrypt(TA, IG);
        const resData = await verifyFCFF(IG,iframeid,convId,rid,T);
        const rjson = JSON.stringify(resData);
        if(rjson.indexOf("cct=")<0){
            throw "go-bingai-pass 似乎没有正常工作！";
        }
    }
    window.addEventListener("load",async ()=>{
        const successDIV = document.getElementById("success");
        const verifyingDIV = document.getElementById("verifying");
        const failDIV = document.getElementById("fail");
        const errorText = document.getElementById("error-text");
        await new Promise((t)=>setTimeout(t,1000));
        try{
            await verify();
        }catch(error){
            console.error("verify error",error);
            verifyingDIV.style.display = "none";
            failDIV.style.display = "flex";
            errorText.innerText = error;
            errorText.style.display = "block";
            setTimeout(()=>location.reload(),5000);
            return;
        }
        verifyingDIV.style.display = "none";
        successDIV.style.display = "flex";
        setTimeout(()=>window.parent.postMessage("verificationComplete", "*"),2000);
    });
})();






