# 开发踩坑记录

本项目开发过程中实际遇到的问题与对策。供以后维护时参考,也记录一些 Windows / 网络环境特有的坑。

## 1. 网络:TLS 拦截导致 GitHub 直连失败

- **现象**:`create-astro` 脚手架从 GitHub 下载模板时报 `SELF_SIGNED_CERT_IN_CHAIN`(本地网络有 HTTPS 中间证书拦截)。
- **影响范围**:npm registry 完全正常,只有直接访问 GitHub 域名受影响。未来 `git push` / `git pull` GitHub 仓库时可能遇到同样的证书报错。
- **对策**:脚手架手动搭建(本项目即如此)。已验证的解决方案:本机有本地代理(127.0.0.1:10808)时,给 git 配代理即可正常访问 GitHub:
  ```bash
  git config --global http.proxy http://127.0.0.1:10808
  git config --global https.proxy http://127.0.0.1:10808
  ```
  不要盲目关闭 `sslVerify`。

## 2. Astro 7 的 API 与旧教程不同

网上大量教程基于 Astro 2–4 的写法,在 7.x 上会报错或弃用:

| 旧写法                                        | Astro 7 正确写法                                                                                                 |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `import { z } from 'astro:content'`           | `import { z } from 'astro/zod'`                                                                                  |
| `entry.render()`                              | `import { render } from 'astro:content'` 然后 `render(entry)`                                                    |
| 集合加载用 `glob`(content.config 里)          | `import { glob } from 'astro/loaders'`                                                                           |
| `getStaticPaths` 参数标注 `{ paginate: any }` | 用 `GetStaticPathsOptions`;分页 props 用 `Page<T>` 手动断言                                                      |
| `markdown.remarkPlugins: [插件]`              | 已弃用。先 `npm install @astrojs/markdown-remark`,再 `processor: unified({ remarkPlugins: [插件] })`(见第 10 条) |

- **经验**:查 API 最可靠的方式是直接看 `node_modules/astro/dist` 里的 `.d.ts` 和源码,官方文档可能滞后于最新版本。

### 2a. Astro 7 默认 Markdown 处理器换成了 Sätteri

- **现象**:配置 `markdown.remarkPlugins` 直接报错,提示 `@astrojs/markdown-remark` 未安装。
- **原因**:Astro 7 起默认用 Sätteri(Native 处理器),它不走 unified/remark 插件生态;旧的 remark/rehype 插件必须挂在官方兼容包 `@astrojs/markdown-remark` 的 `unified()` 处理器上。
- **方案**:
  ```js
  import { unified } from '@astrojs/markdown-remark';
  // astro.config.mjs
  markdown: {
    processor: unified({ remarkPlugins: [wikilinkPlugin] }),
  },
  ```
  GFM、smartypants 默认值不变,渲染行为与旧版一致。

### 2b. 自定义 Markdown 插件会在「内容同步」阶段执行,不能调用 astro:content

- **现象**:双链插件里 `await import('astro:content')` + `getCollection()` 导致所有 Markdown 解析失败:`[glob-loader] Error rendering xxx.md: Failed to parse Markdown file`;症状诡异——构建能"成功"结束但**所有笔记正文变空**,且错误结果被缓存进 `node_modules/.astro/data-store.json`(删 `.astro/` 清不掉,必须连 `node_modules/.astro` 一起删)。
- **原因**:内容层同步时逐文件解析 Markdown(remark 插件此时就跑),插件内再调用 `astro:content` 会重入尚未就绪的内容层。
- **方案**:插件需要的元数据(如标题→slug 索引)**直接读磁盘上的 .md 文件**构建(同步阶段所有文件都已存在,索引完整)。本项目 `src/lib/wikilink-plugin.ts` 即用 `node:fs` 读 `src/content/notes/*.md` 提取 frontmatter title。

## 3. `paginate()` 要求路由文件名带 `[page]`

- **现象**:把分页页写成 `notes/index.astro` 时,构建报错 `Cannot read properties of undefined (reading 'currentPage')` —— 错误信息完全看不出原因。
- **原因**:Astro 的 `paginate()` 要求路由文件名为 `[page].astro` 或 `[...page].astro`。
- **方案**:本项目用 `notes/[...page].astro`。好处:第一页 URL 是干净的 `/notes/`,第二页才是 `/notes/2/`。

## 4. Windows 上 `astro preview` 对中文路径有 bug

- **现象**:`npm run preview` 后访问 `/categories/前端/`、`/tags/数字花园/` 等中文路径返回 500(响应体其实是正确的完整 HTML)。报错为 `URIError: URI malformed`,出在 Astro 内部 `fileURLToPath` 对非 ASCII 路径的处理。
- **影响**:仅限本地 preview 服务器;构建产物(`dist/`)本身正确,Cloudflare Pages 等静态托管直接按文件发内容,不受影响。
- **替代验证方法**:本地想验证构建产物时,用 `python -m http.server 4323`(在 dist 目录下)或 `npx serve dist`,中文路径正常 200。
- **测试注意**:curl 测中文 URL 必须用百分号编码(如 `%E5%89%8D%E7%AB%AF` = 前端),shell 里直接写原始中文可能因编码问题误判。

## 5. dev 服务器是后台守护进程,路由改动后需重启

- **现象**:`npm run dev` 命令很快退出(exit 0),但服务器在后台继续运行。改名或新增 `src/pages/` 下的路由文件后,旧 dev 服务器可能不同步,出现本该存在的页面 404/500。
- **对策**:路由文件改名后重启 dev:
  ```bash
  netstat -ano | grep ":4321"   # 找 PID
  taskkill //F //PID <pid>
  npm run dev
  ```
  普通的内容/CSS 改动则会被 HMR 自动同步,无需重启。

## 6. dev 服务器只绑定 IPv6 localhost

- `npm run dev` 后服务器监听 `[::1]:4321`。用 curl 测试时写 `http://localhost:4321`,不要写 `http://127.0.0.1:4321`(会连不上)。

## 7. 主题系统:两个暗色块必须同步修改

- `src/styles/tokens.css` 里暗色变量有两个块:`@media (prefers-color-scheme: dark)` 和 `:root[data-theme='dark']`。两者内容必须完全一致(前者管跟随系统,后者管手动切换)。
- **踩过的坑**:批量替换时因两处缩进不同只改到了一个块,导致「跟随系统」和「手动切换」颜色不一致。改完务必两处对照检查。

## 8. esbuild 安装警告无害

- `npm install` 时 esbuild 的 postinstall 提示(allow-scripts 相关)可忽略:平台二进制通过 optionalDependencies 正常安装,不影响构建。

## 9. 文件命名约定

- 笔记文件用 ASCII slug(如 `astro-static-site.md`),中文标题写在 frontmatter 的 `title` 里。URL 保持纯 ASCII,避免各平台对非 ASCII 文件名的兼容差异。
- 分类/标签是自由字符串(可为中文),由 Astro 构建时生成对应目录,跨平台部署已验证正常(见第 4 条)。

## 10. 构建器会改写动态 import,运行时加载外部文件要用 Function 包一层

- **现象**:构建产物里 `import('/pagefind/pagefind.js')` 被编译成 `import(url, __VITE_PRELOAD__)`,而这个 `__VITE_PRELOAD__` 在整个产物里**只被引用、从未定义**,浏览器执行时抛 `ReferenceError`,搜索永远提示"暂无索引"。服务器端怎么查都正常(文件 200、MIME 正确),因为坏的是产物里的 JS 本身。
- **原因**:即使写了 `/* @vite-ignore */`,构建器(rolldown)仍会把动态 import 改写为预加载辅助函数形式,而 Pagefind 这类"构建后才生成、不在模块图里"的运行时文件没有对应的辅助函数定义。
- **方案**:用 `Function` 构造器把 import 藏起来,构建器看不到就不会改写:
  ```js
  const mod = await Function("p", "return import(p)")("/pagefind/pagefind.js");
  ```
- **验证经验**:只靠 curl 查文件/响应头是不够的。本项目最后用 Chrome 无头模式(`chrome.exe --headless=new --dump-dom`,配合测试页把结果写进 `<title>`)在真实浏览器里跑通"加载→初始化→搜索→取结果"全流程,才确认修复。以后凡是"浏览器行为"类 bug,优先用无头浏览器复现。
- **抓控制台报错**:`chrome.exe --headless=new --enable-logging=stderr --v=0 --dump-dom <url> 2>&1 | grep -i CONSOLE` 可以把页面的 JS 报错打到终端。

## 11. 给客户端组件传数据的正确姿势（阶段 4 踩坑）

知识图谱组件需要在客户端脚本里拿到构建时算好的节点/连线数据,两个坑:

- **Astro 7 不会把 `Astro.props` 序列化进客户端脚本**。在 `<script>` 里写 `Astro.props.nodes` 能通过类型检查,但产物里只留下裸的 `Astro.props` 引用,页面里没有任何定义,运行时报 `Astro is not defined`。
- **`<script>` 标签体不是模板,不做插值**。写 `<script type="application/json">{data}</script>` 会把字面的 `{data}` 原样输出到页面,JSON.parse 报 SyntaxError。

**方案**:用 `set:html` 把序列化数据注入 `<script type="application/json">`,客户端脚本自己 `JSON.parse`:

```astro
---
const data = JSON.stringify({ nodes, links }).replace(/</g, '\\u003c');
---
<script type="application/json" id="knowledge-graph-data" set:html={data}></script>
```

- **另外**:force-graph 自带的 `.d.ts` 与实际用法不符(默认导出不可调用、回调参数类型缺失)。写 `declare module` 的 d.ts 会被包自带的类型覆盖而失效;正确做法是建一个本地包装模块(`src/lib/force-graph.ts`)把默认导出断言成自己的宽松接口,组件从本地模块导入。
- **包装接口的返回类型不能图省事写 `unknown`**:包装里 `graphData()` 返回类型曾写成 `unknown`(运行时它和其他 accessor 一样返回实例本身),导致链式调用 `.graphData(...).nodeId(...)` 报 TS2571,且该错误让链条后续全部降级为 `any`,回调参数变成隐式 any(TS7006),一共 4 个报错。教训:accessor 类方法一律返回 `ForceGraphInstance`;要拿运行时返回的数据对象时,在调用处用 `as unknown as { links: GraphLink[] }` 断言。

## 12. 新版 Cloudflare 面板的「连接 Git」建的是 Workers 项目,不是 Pages(阶段 6 踩坑)

- **现象**:新版面板里走 Create → GitHub 向导(填 project name / build command / deploy command / API token),部署时报 `The Pages project "xxx" does not exist`;更早时 API 报 `Authentication error [code: 10000]`。
- **原因**:该向导建的是 **Workers 项目**(URL 形如 `/workers/services/view/<name>`,即 Workers Builds 流程),不是 Pages 项目。用 `wrangler pages deploy` 部署当然找不到 Pages 项目;向导自动创建的 token 也只有 Workers 权限、没有 Pages 权限(反之亦然,权限在 token 编辑页按需添加)。
- **方案**:
  - 仓库加 `wrangler.jsonc`,纯静态站点只需声明 assets:
    ```jsonc
    {
      "name": "my-knowledge",
      "compatibility_date": "2026-08-01",
      "assets": { "directory": "./dist", "not_found_handling": "404-page" }
    }
    ```
  - 部署命令用 `npx wrangler deploy`(不是 `pages deploy`)。
  - token 权限(https://dash.cloudflare.com/profile/api-tokens):Workers 部署要「账户 → Workers Scripts → 编辑」,Pages 部署要「账户 → Cloudflare Pages → 编辑」。
  - `not_found_handling: "404-page"` 才会让缺失路径返回 404.html;`wrangler pages deploy` 不会自动创建项目(先 `wrangler pages project create`)。
- **验证注意**:workers.dev / pages.dev 共享域名国内直连超时属正常,不代表部署失败;验证线上站点可走本地代理。国内正式使用需绑定自有域名并同步更新 `PUBLIC_SITE_URL`。
