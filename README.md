# microsoft-copilot-porxy
## 简介

**Cloudflare Worker 的 Microsoft Copilot 代理。**

**Microsoft Copilot 是基于 OpenAI GPT-4 的强大 AI 并且能够使用 Bing 搜索来解答问题。**

**简单部署即可在国内轻松使用原滋原味的 Microsoft Copilot 的几乎全部功能，聊天，笔记本，插件，图像生成，分享等等..**


![335075014-0ca073cb-f6b8-47ff-befd-8876399a2b3e](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/7d7b54f0-1298-4094-9764-156eb77ad709)
![屏幕截图 2024-06-11 150121](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/c547568b-1bc3-4a3a-bb8f-be50d8a8c403)
![336297043-308f7113-e5b0-4d6c-a958-ef67639323f8](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/1a2571f5-1512-4ef7-9f92-0ccee08b6bd7)




## 亮点
- 🎉可在国内直接使用
- 🚀cloudflare worker一件部署无需其他操作，完全免费无限制
- ⚡高速访问，cloudflare是全球最大的CDN

## 特色功能
- 🧱过滤大量用于统计的无意义请求，节约 80% cloudflare worker 请求次数。


## 演示站
- Copilot -> https://copilot.6m6c.cn/
- Copilot(新版) -> https://copilot.6m6c.cn/?dpwa=1
- Designer -> https://copilot.6m6c.cn/images/create

## 登录方式

> [!CAUTION]
> **重要的安全使用法则**
> 1. 不要轻易在代理站输入自己的账号和密码，**站点部署者可以轻易得到你的账号密码！**
> 2. 请保证，只在信任的代理站使用密码登录！
> 3. 输入密码前一定要确认代理站域名是你信任的域名！
> 4. 如果一定要在不信任的代理站登录，可以使用邮件验证码或者Authenticator登录。
> 5. 使用完不信任的代理站后，第一时间退出登录。
> 6. 如果已经在不信任的代理站使用密码登录过，请立即修改微软账号密码。

> [!TIP]
> **如果你需要经常使用，建议自己部署代理站，这样是最安全的选择。**

> [!TIP]
> **我部署的演示站不会保存任何信息，如果你信任我，那么演示站也是不错的选择。**

<details>
<summary>直接登录(推荐)</summary>
	
- 1.点击登录按钮

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/4c926bfe-8e7c-4336-a1d1-95bb46c32b44)

- 2.输入微软账号

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/79ca77a0-e5d2-4f06-972d-8cb56aebe561)

- 3.输入密码

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/cc67c302-2d60-43c5-84ac-b85a05801624)


- 4.完成登录

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/0b3dcf6e-144a-48b1-9160-f9dad3cda40c)
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/510ab517-9fc5-4816-bd80-2702040923cc)

</details>


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
### 自动部署 (不熟悉开发流程的小伙伴推荐)
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jianjianai/microsoft-copilot-porxy)
<details>
<summary>详细教学，点击展开</summary>

	
1. 点击这个部署按钮

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jianjianai/microsoft-copilot-porxy)

2. 在打开的页面点击`Authorize Workers`

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/038878d6-99b1-494d-a5a1-9c0a39c30c27)

3. 如果有 Cloudflare 账号则点击 `I have an account` 如果没有则点击 `Create account` 去创建一个。

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/1d6c1272-1d48-4120-9181-0eaf137851a9)

4. 去复制账户id 

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/f22c5e02-0742-4222-8e91-7104756de804)

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/2125bfe9-d8cd-414d-b929-a39769454233)

5. 去创建APIKEY

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/6835fea6-7dc9-4520-b927-91e42e7a945d)

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/93a2069e-b302-47e7-b9dd-75d8ac356e29)

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/595d8bcf-fb07-405b-b8dc-97f0a012dc13)

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/c2635a88-90f0-4721-aaa9-7dbd0cb8cd3a)

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/448e3422-1fef-4e08-91f5-e8ce8f6b7056)

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/d0b31bf6-8f69-430f-843a-ff8d3113820d)

5. 连接账户

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/8909bd89-10dc-4c3d-8250-eea9b2e5f71e)

6. Fork repository

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/08761a46-4a74-4c98-b7b7-36dea356068a)

8. 启用 GitHub Actions

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/657b6ff3-fc35-4a6e-b62a-a504f6b2f8e5)

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/1d725360-332c-4d01-adc0-0c2ab2761dc2)

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/c43605a8-338d-485c-bb39-e3f9c87d91f5)

9. 部署

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/fe4fc988-3693-4283-a087-7f31ecd6ca0d)

10. 成功

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/f1557d7f-0a12-4622-87ab-6236f0bbad67)

11. 管理页面出现新的 Workers 和 Pages 后续可以进行其他设置。

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/98a0b65b-0019-4cad-b744-1d9454d8d4e7)

12. 添加自定义域

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/a4595828-d79d-48c8-81df-c16304941c91)


> **默认的 `.workers.dev` 国内已被限制访问，需要使用自定义域才可正常访问。** 
> 具体方法请[点击此处](https://www.bing.com/search?q=cloudflare+workers+%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9F%9F%E5%90%8D)查找


> **免费自定义域名可以参考这个视频的 3分54秒 后的免费域名部分**
> 【精准空降到 03:54】 https://www.bilibili.com/video/BV1Dy41187dv/?share_source=copy_web&vd_source=92a3be464320d250ae4c097a77339ef5&t=234

13 后续更新

同步 github 仓库后 Workers 和 Pages 会自动同步更新。

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/f26b3753-0963-4a78-8773-7a9b6ebc1199)


</details>

### 手动部署
<details>
<summary>点击展开</summary>

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

</details>



## 交流社区
- QQ群: 829264603
