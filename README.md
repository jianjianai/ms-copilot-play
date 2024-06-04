# microsoft-copilot-porxy
## 简介

**cloudflare worker 的 microsoft copilot 代理。简单部署即可在国内轻松使用 microsoft copilot**


![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/0ca073cb-f6b8-47ff-befd-8876399a2b3e)
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/308f7113-e5b0-4d6c-a958-ef67639323f8)


## 优缺点
- 🎉可在国内直接使用
- 🚀cloudflare worker一件部署无需其他操作，完全免费无限制
- ⚡高速访问，cloudflare是全球最大的CDN


## 演示站
- 尽量自己部署吧，估计演示站几天就挂了。
- Copilot -> https://copilot.6m6c.cn/
- Designer -> https://copilot.6m6c.cn/images/create

## 登录方式

- 1.点击登录按钮

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/4c926bfe-8e7c-4336-a1d1-95bb46c32b44)

- 2.输入微软账号

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/79ca77a0-e5d2-4f06-972d-8cb56aebe561)

- 3.输入密码

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/cc67c302-2d60-43c5-84ac-b85a05801624)


- 4.完成登录

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/0b3dcf6e-144a-48b1-9160-f9dad3cda40c)
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/510ab517-9fc5-4816-bd80-2702040923cc)



<details>
<summary>过时又麻烦的登录方式</summary>

- 1.在[bing](bing.com)中登录微软账号。

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/0ca08266-f3e2-4ed5-bbc7-eef3982734dc)

- 2.按F12打开开发者工具执行以下javascript脚本。会输出用于登录的脚本，将其复制。

``` javascript
console.log(`((c)=>c.split(/; ?/).map((t)=>{const index = t.indexOf("=");return [t.substring(0,index),t.substring(index+1)]}).forEach((kv)=>{cookieStore.set(kv[0],kv[1])}))("${document.cookie}");`);
```
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/f9a0c93d-a4d8-4a78-b2d9-7809218bb0c5)

- 3.打开自己部署的代理网站，按F12执行刚才复制的脚本。

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/c95d6e30-f941-4290-9901-d98b6b7b5bbb)

- 4.刷新自己部署的代理网站，登录成功！

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/6f61f8c7-af65-4155-82bc-c868b264e9e9)

</details>





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


## 交流社区
- QQ群: 829264603
