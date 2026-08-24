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

| 旧写法 | Astro 7 正确写法 |
|---|---|
| `import { z } from 'astro:content'` | `import { z } from 'astro/zod'` |
| `entry.render()` | `import { render } from 'astro:content'` 然后 `render(entry)` |
| 集合加载用 `glob`(content.config 里) | `import { glob } from 'astro/loaders'` |
| `getStaticPaths` 参数标注 `{ paginate: any }` | 用 `GetStaticPathsOptions`;分页 props 用 `Page<T>` 手动断言 |

- **经验**:查 API 最可靠的方式是直接看 `node_modules/astro/dist` 里的 `.d.ts` 和源码,官方文档可能滞后于最新版本。

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
