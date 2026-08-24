---
title: Astro 内容集合与 Frontmatter
description: 用内容集合和 schema 校验管理笔记的元数据。
pubDate: 2026-07-20
updatedDate: 2026-08-18
category: 前端
tags: [Astro, Markdown]
status: organizing
---

内容集合（Content Collections）让 Markdown 文件的元数据（Frontmatter）经过 schema 校验，写错时构建直接报错并指出文件位置。

## 典型的笔记 Frontmatter

```yaml
---
title: 笔记标题
description: 一句话摘要
pubDate: 2026-08-24
updatedDate: 2026-08-24
category: 前端
tags: [Astro, 双链]
status: organizing
---
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| title | 是 | 笔记标题 |
| description | 否 | 摘要，用于列表和 SEO |
| pubDate | 是 | 发布日期 |
| updatedDate | 否 | 更新时间，缺省等于 pubDate |
| category | 否 | 单个分类，缺省归入"未分类" |
| tags | 否 | 多个标签 |
| status | 否 | 学习状态，默认 organizing |

相关阅读：[[astro-static-site]]
