# 我的知识花园

个人知识库 / Digital Garden 网站，纯静态架构：Markdown 文件是唯一内容源，由 Astro 构建为静态页面，部署到 Cloudflare Pages。

## 本地开发

```bash
npm install
npm run dev      # 开发服务器 http://localhost:4321
npm run build    # 构建到 dist/
npm run preview  # 本地预览构建产物
npm run check    # TypeScript 类型检查
```

## 添加一篇笔记

1. 在 `src/content/notes/` 下新建 `.md` 文件，文件名用 ASCII slug（如 `my-note.md`），中文标题写在 Frontmatter 的 `title` 中。
2. 填写 Frontmatter：`title` 和 `pubDate` 必填，其余字段见 `src/content/notes/content-collections.md` 的说明。
3. 正文中用 `[[其他笔记文件名]]` 建立双链。
4. 提交 Git 后，部署平台会自动重新构建发布。

## 部署

- 平台：Cloudflare Pages。构建命令 `npm run build`，输出目录 `dist/`，环境变量 `PUBLIC_SITE_URL` 设为站点完整 URL（如 `https://your-site.pages.dev`）。
- 迁移到 Vercel 等平台时只需导入同一仓库，构建配置相同，无需改动代码。
