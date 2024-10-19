# microsoft-copilot-play-app
## 简介

**Cloudflare Worker 的 Microsoft Copilot 加速服务 app。**

**Microsoft Copilot 是基于 OpenAI GPT-4 的强大 AI 并且能够使用 Bing 搜索来解答问题。**

**简单部署即可在国内高速使用原滋原味的 Microsoft Copilot 的几乎全部功能，聊天，笔记本，插件，图像生成，分享等等..**


![5c2ed6ab2ba7d90d975a81da50ba050d](https://github.com/user-attachments/assets/2147ff10-2792-43e4-ac4a-30915b05a3eb)



## 亮点
- 🎉可在国内高速访问
- 🚀cloudflare worker一件部署无需其他操作，完全免费无限制
- ⚡高速访问，cloudflare是全球最大的CDN

## 演示站
- Copilot -> https://copilot.6m6c.cn/


## CloudFlare Pages 部署
<details>
<summary>详细教学，点击展开</summary>

1.Fork此仓库

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/d61bf46d-7edf-43de-b66c-ede1f8cefed2)
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/3a4be71a-bd12-4938-add8-00998c5ca0aa)

2. Page连接到GitHub

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/598dd9c8-05d9-46dc-9c9b-a15da56ff0b5)
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/85286d7c-913e-4550-b867-344e537077b6)
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/c118fe5b-1684-40f5-9b5a-b719d22e17be)
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/78ffc287-f472-4758-8df1-2f14aa5a70a4)
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/cd63bb70-6e6d-435f-8691-0f7734e88605)

3. 设置设置仓库

输入构建命令
``` shell
npm run build-page
```
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/02fbfe54-f760-4a02-9946-e57ca3ecb648)

之后就完成了。
![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/ce012d84-7df9-426b-877e-42e6fe77872e)


4. 后续更新

同步 github 仓库后 Workers 和 Pages 会自动同步更新。

![image](https://github.com/jianjianai/microsoft-copilot-porxy/assets/59829816/f26b3753-0963-4a78-8773-7a9b6ebc1199)
</details>


## CloudFlare Worker 部署
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
|wget|```apt install wget```|
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

<details>

- [神奇小破站](https://jjaw.cn/)

</details>

</details>


## 交流社区
- QQ群: 829264603
