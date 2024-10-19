import { appendFile,mkdirSync,existsSync } from "fs";
(()=>{
   if(!existsSync(`${__dirname}/iiptest`)){
    mkdirSync(`${__dirname}/iiptest`)
   }
})();

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
    if(txt.indexOf('<div class="title" role="heading" aria-level="1">登录以体验 Microsoft Copilot</div>')>=0){
        console.log(ip,"ddddddddddd");
        return false;
    }

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
    appendFile(`${__dirname}/iiptest/iiptest.txt`,`${ip} ${rg}\n`,(error)=>{if(error){console.log(error)}});
    appendFile(`${__dirname}/iiptest/iiptest-${rg}.txt`,`${ip} ${rg}\n`,(error)=>{if(error){console.log(error)}});
    return true;
}

const testAll = async (i:number,i0:number,i1:number,i2:number)=>{
    const testNext = async()=>{
        i2++;
        if(i2>255){
            i2 = 1;
            i1++;
        }
        if(i1>255){
            i1 = 1;
            i0++;
        }
        if(i0>255){
            i0 = 1;
            i++;
        }
        if(i>255){
            return false;
        }
        const XForwardedForIP = `${i}.${i0}.${i1}.${i2}`;
        try{
            await isipok(XForwardedForIP);
        }catch(error){
            console.error(error);
        }
        return true;
    }
    let count = 0;
    let stop = false;
    while(true){
        while(count>=16){
            await new Promise((t)=>{setTimeout(t,100)});
        }
        count++;
        testNext().then((rt)=>{
            count--;
            if(!rt){
                stop = true;
            }
        });
        if(stop){
            break;
        }
    }
}
testAll(104,28,1,1);


