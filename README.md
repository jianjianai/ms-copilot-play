# microsoft-copilot-porxy
## 简介

**cloudflare worker 的 microsoft copilot 代理。简单部署即可在国内轻松使用 microsoft copilot**


![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/0ca073cb-f6b8-47ff-befd-8876399a2b3e)

## 优缺点
- 🎉可在国内直接使用

## 登录方式
``` javascript
console.log(`((c)=>c.split(/; ?/).map((t)=>{const index = t.indexOf("=");return [t.substring(0,index),t.substring(index+1)]}).forEach((kv)=>{cookieStore.set(kv[0],kv[1])}))("${document.cookie}");`);
```

## 演示站
- 尽量自己部署吧，估计演示站几天就挂了。
- https://copilot.6m6c.cn/

## 部署
### 环境
|名称|下载地址|
|-|-|
|git|https://git-scm.com/download|
|nodejs|https://nodejs.org|


### 命令
- 1.下载源代码
``` shell
git clone https://github.com/jianjianai/microsoft-copilot-porxy
```
- 2.进入源代码目录
``` shell
cd microsoft-copilot-porxy
```
- 3.安装依赖包
``` shell
npm install
```
- 4.编译部署
``` shell
npm run deploy
```
