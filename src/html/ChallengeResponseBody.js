import { fCFF } from '../go-bingai-pass/worker';

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
    console.log("verifyFCFF",resData);
}

window.onload =  async function() {
    const IG = window.parent._G.IG;
    const convId = window.parent.CIB.manager.conversation.id;
    const rid = window.parent.CIB.manager.conversation.messages[0].requestId;
    const iframeid = new URL(window.location.href).searchParams.get('iframeid');
    const T = await window.parent.aesEncrypt('Harry-zklcdc/go-proxy-bingai',IG);
    try{
        await verifyFCFF(IG,iframeid,convId,rid,T);
        window.parent.postMessage("verificationComplete", "*");
    }catch(error){
        const verifyContainer = document.getElementById('verifyContainer');
        verifyContainer.innerHTML = '';
        let newElement = document.createElement('h4');
        newElement.textContent = "发生错误"+error;
        verifyContainer.appendChild(newElement);
        setTimeout(()=>{
            window.parent.postMessage("verificationFailed", "*");
        },5000);
    }
};


