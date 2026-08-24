# 项目状态总览

> 本文件由开发过程实时维护。内容以仓库当前实际代码为准，最后更新于 2026-08-24。

## 1. 项目目标

个人知识库 / Digital Garden 网站（「我的知识花园」）：

- **Markdown 是唯一内容源**：笔记以 `.md` 文件管理在 Git 里，Frontmatter 写元数据，正文用 `[[双链]]` 连接想法。
- **纯静态架构**：无后端、无数据库，Astro 构建为静态页面，部署到 Cloudflare Pages（配置与平台解耦，可平移到 Vercel 等）。
- **14 项明确需求**分 7 个阶段实现，每阶段用户验收后再进入下一阶段，不擅自增加需求、不过度设计。

## 2. 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Astro 7.2.4（静态输出，Node ≥ 20.3） |
| 内容 | astro:content + glob loader + zod schema 校验 |
| Markdown | @astrojs/markdown-remark 的 unified 处理器（Astro 7 默认 Sätteri 不支持 remark 插件）+ 自研双链插件 |
| 全文搜索 | Pagefind 1.5.2（构建后生成 `/pagefind/` 静态索引） |
| 知识图谱 | force-graph 1.51.4（Canvas 2D，客户端懒加载） |
| 主题 | CSS 自定义属性，系统偏好 + 手动切换（localStorage） |
| 质量工具 | astro check（TS 类型）、Prettier |
| 部署目标 | Cloudflare Pages（`PUBLIC_SITE_URL` 环境变量注入站点地址） |

## 3. 已完成的功能（阶段 0–4，均经用户验收）

- **阶段 0 骨架与主题**：基础布局（Header/Footer/BaseLayout）、米色纸张 + 深紫藏青暗色双主题（系统跟随 + 手动切换 + 防闪烁）、移动端菜单。
- **阶段 1 内容系统**：6 篇示例笔记、首页（最近笔记 + 分类标签概览）、笔记列表（updatedDate 降序分页 10 篇/页）、笔记详情（TOC、上一篇/下一篇）、分类页、标签页、关于页、笔记状态徽章（学习中/整理中/已掌握/归档）。
- **阶段 2 双链系统**：`[[笔记名]]` / `[[笔记名|别名]]` 语法（remark 插件转换）、缺失链接提示、出链/反向链接展示、相关笔记（共享标签 +2 / 同分类 +2 / 出链 +3 / 回链 +2，取前 5）。
- **阶段 3 全文搜索**：Ctrl+K / 页头按钮打开弹窗、Pagefind 静态索引、结果关键词高亮（正文 + 标题）、构建产物与开发模式区分提示。
- **阶段 4 知识图谱**：全局图谱页 `/graph/`（按连接度取前 200 篇、按分类哈希着色、图例、满屏布局）、每篇笔记底部局部图谱（一跳邻居、上限 60 节点）、点击跳转、悬停高亮邻居、拖拽钉住、滚轮缩放、懒加载（client:visible）、主题切换时画布颜色跟随。
- **配套**：`docs/pitfalls.md`（11 个实际踩坑记录）、README、Git 仓库已推送 GitHub（main 分支）。

## 4. 当前正在做的功能

**阶段 4 收尾（已推送，待用户最终视觉确认）**：图谱页满屏布局的页脚间距微调——页脚间距通过 CSS 变量 `--footer-margin-top` 覆盖，本页设为 1rem，与顶部间距对称。

## 5. 尚未完成的功能

只剩两个阶段：

1. **阶段 5：订阅与 SEO**
   - RSS 订阅源 `rss.xml`（需安装 `@astrojs/rss`）
   - sitemap 站点地图（需安装 `@astrojs/sitemap`）
   - `robots.txt`
   - 友好 404 页（带推荐笔记）
2. **阶段 6：打磨与上线**
   - 全站响应式审计（重点：图谱页悬浮卡片、搜索弹窗、移动端菜单）
   - Lighthouse 性能检查
   - 中文搜索质量复查（必要时换 FlexSearch）
   - Cloudflare Pages 实际部署 + 自定义域名
   - README 收尾核对

## 6. 已知问题

1. **Windows 上 `astro preview` 访问中文路径报 500**（URIError，响应体其实是正确 HTML）。仅影响本地预览命令；部署到 Cloudflare Pages 不受影响。本地验证构建产物请用 `python -m http.server`（见 pitfalls.md 第 4 条）。
2. **Pagefind 对中文没有分词/词干支持**（构建时会有 warning）。中文可以按子串搜到，但不会跨词匹配；阶段 6 若觉得不够用可换 FlexSearch。
3. **dev 服务器是后台守护进程**：改路由文件名或 astro.config 后需要手动杀掉重启（netstat + taskkill，见 pitfalls.md 第 5 条）。
4. **本机网络访问 GitHub 需代理**：git 已配全局代理 `127.0.0.1:10808`；换网络环境后如需直连可去掉该配置。
5. **force-graph 自带类型声明与实现不符**：用 `src/lib/force-graph.ts` 包装断言；升级 force-graph 后需重新验证类型与运行时行为。
6. 图谱页页脚间距最后调整为 1rem，尚未得到用户视觉确认（见第 4 节）。

## 7. 下一步具体任务

**阶段 5（按顺序）：**
1. `npm install @astrojs/rss @astrojs/sitemap`
2. 新建 `src/pages/rss.xml.ts`（全部笔记条目，标题/描述/日期）
3. `astro.config.mjs` 中启用 sitemap 集成（`site` 已支持 `PUBLIC_SITE_URL`）
4. 新建 `src/pages/robots.txt.ts`（允许全部、指向 sitemap）
5. 新建 `src/pages/404.astro`（提示 + 推荐几篇笔记，沿用 BaseLayout）
6. 构建 + 无头浏览器验证 + 推送，交用户验收

**阶段 6（按顺序）：**
1. 响应式检查与修复
2. Lighthouse 跑分并处理发现的问题
3. 中文搜索体验复查，决定是否换 FlexSearch
4. Cloudflare Pages 部署（构建命令 `npm run build`、输出目录 `dist/`、环境变量 `PUBLIC_SITE_URL`）
5. README 与 PROJECT_STATUS.md 收尾

## 8. 重要的设计决策和约定

- **内容源单一**：一切以 `src/content/notes/*.md` 为准，构建时生成所有页面；分类/标签页、图谱、相关笔记均从笔记集合推导。
- **笔记文件用 ASCII slug**，中文标题写在 Frontmatter `title`；分类/标签是自由字符串（可为中文），URL 经 encodeURIComponent。
- **排序与分页**：笔记列表按 updatedDate 降序（缺省用 pubDate）；分页 10 篇/页。
- **双链**：`[[目标]]` / `[[目标|显示文字]]`；目标先按 Frontmatter title 匹配、再按文件 id 匹配。remark 插件**直接读磁盘**构建标题索引（内容同步阶段不能调用 astro:content，会死锁，见 pitfalls.md 第 2b 条）。
- **搜索**：快捷键 Ctrl+K；索引范围用 `data-pagefind-body` / `data-pagefind-ignore` 控制（正文入索引，页头页脚/双链区块/图谱排除）；运行时加载 Pagefind 用 `Function('p','return import(p)')` 包住，防止构建器改写动态 import（pitfalls.md 第 10 条）。
- **主题**：颜色全部走 `tokens.css` 的 CSS 变量；「系统暗色」与「手动暗色」两个块必须同步修改（pitfalls.md 第 7 条）；画布类组件（图谱）在运行时读 CSS 变量并监听主题变化刷新。
- **图谱配色**：按分类名哈希取 10 色调色板，全局与局部图谱一致；性能上限为全局 200 节点 / 局部 60 节点。
- **给客户端组件传数据**：Astro 7 不会序列化 `Astro.props` 进客户端脚本，统一用 `<script type="application/json" set:html={...}>` 注入 + 客户端 JSON.parse（pitfalls.md 第 11 条）。
- **踩坑必须记录**：每解决一个新坑就追加到 `docs/pitfalls.md`，避免下次重蹈。
- **Git 协作约定**：每个功能/修复一个提交，提交信息中文描述；推送前必须 `npm run check` 与 `npm run build` 通过。
