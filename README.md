# microsoft-copilot-porxy
## 简介

**cloudflare worker 的 microsoft copilot 代理。简单部署即可在国内轻松使用 microsoft copilot**


![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/0ca073cb-f6b8-47ff-befd-8876399a2b3e)

## 优缺点
- 🎉可在国内直接使用

## 演示站
- 尽量自己部署吧，估计演示站几天就挂了。
- https://copilot.6m6c.cn/

## 登录方式
- 1.在[bing](bing.com)中登录微软账号。

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/0ca08266-f3e2-4ed5-bbc7-eef3982734dc)

- 2.按F12打开开发者工具执行以下javascript脚本，并回车执行。会输出用于登录的脚本，将其复制。

``` javascript
console.log(`((c)=>c.split(/; ?/).map((t)=>{const index = t.indexOf("=");return [t.substring(0,index),t.substring(index+1)]}).forEach((kv)=>{cookieStore.set(kv[0],kv[1])}))("${document.cookie}");`);
```
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/f9a0c93d-a4d8-4a78-b2d9-7809218bb0c5)

- 3.打开自己部署的代理网站，按F12执行刚才复制的脚本。

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/c95d6e30-f941-4290-9901-d98b6b7b5bbb)

- 4.刷新自己部署的代理网站，登录成功！

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/6f61f8c7-af65-4155-82bc-c868b264e9e9)





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
