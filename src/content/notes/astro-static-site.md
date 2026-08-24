---
title: Astro 静态站点入门
description: 为什么选择 Astro 构建个人知识库，以及它的核心设计理念。
pubDate: 2026-07-15
updatedDate: 2026-08-20
category: 前端
tags: [Astro, 静态网站]
status: mastered
---

Astro 是一个为**内容型网站**设计的静态站点生成器，非常适合个人知识库这类场景。

## 核心特性

- **零 JS 默认**：构建出的页面默认不携带任何 JavaScript，加载极快。
- **岛屿架构**：需要交互的部分（如知识图谱）作为"岛屿"按需加载，不影响其余页面。
- **内容优先**：Markdown 文件即内容源，配合 [[content-collections]] 获得类型安全的元数据校验。

## 构建与部署

```bash
npm run dev      # 本地开发
npm run build    # 构建静态产物到 dist/
npm run preview  # 预览构建结果
```

构建产物是纯静态文件，可以部署到任何静态托管平台。

## 与本站的关系

本知识库即由 Astro 构建。笔记之间的引用使用 [[wikilinks]] 语法互相连接。
