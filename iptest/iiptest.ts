import { appendFile } from "fs";

const isipok=async (ip:string)=>{
    const ret = await fetch("https://copilot.microsoft.com/",{
        headers:{
            "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language":"zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
            "X-forwarded-for": ip
        }
    });
    if(!ret.ok){
        console.log(ip,false);
        return false;
    }
    const txt = await ret.text();
    const rt = /Region:"(.*?)"/.exec(txt);
    if(!rt){
        console.log(ip,false);
        return false;
    }
    const rg = rt[1];
    if(!rg){
        console.log(ip,false);
        return false;
    }
    console.log(ip,rg);
    appendFile(`${__dirname}/iiptest.txt`,`${ip} ${rg}\n`,(error)=>{if(error){console.log(error)}});
    if(rg=="US"){
        appendFile(`${__dirname}/iiptest-US.txt`,`${ip} ${rg}\n`,(error)=>{if(error){console.log(error)}})
    }
    return true;
}

const testAll = async ()=>{
    let i1 = 1;
    let i2 = 1;
    const testNext = async()=>{
        i2++;
        if(i2>255){
            i2 = 1;
            i1++;
        }
        if(i1>255){
            return false;
        }
        const XForwardedForIP = `104.28.${i1}.${i2}`;
        await isipok(XForwardedForIP);
        return true;
    }
    let witeList:Promise<boolean>[] = [];
    let next:Promise<boolean>;
    while(true){
        next = testNext();
        witeList.push(next);
        if(witeList.length>=10){
            let rt = await Promise.all(witeList);
            if(rt.includes(false)){
                break;
            }
            witeList = [];
        }
    }
}
testAll();


