---
title: 双链笔记语法
description: 用 [[笔记名称]] 在笔记之间建立连接。
pubDate: 2026-08-10
updatedDate: 2026-08-10
category: 方法论
tags: [双链, Markdown]
status: learning
---

双链（Wikilink）让笔记不再是孤岛：在正文中写下 `[[目标笔记]]`，即可链接到另一篇笔记。

## 基本语法

在正文中直接写下 `[[目标笔记]]` 即可，下面是真实示例：

- [[content-collections]] —— 链接到存在的笔记，渲染为内部链接。
- [[astro-static-site|Astro 入门]] —— 用「|」自定义显示文字。
- [[还没写的笔记]] —— 目标不存在时，渲染为带提示的"失效链接"样式，提醒你补一篇。

> 行内代码里的 `[[content-collections]]` 不会被转换，正文里的才会。

## 反向链接

每篇笔记底部会自动显示**反向链接**：哪些笔记引用了当前笔记。双向的连接让知识自然形成网络，这也正是 [[digital-garden]] 理念的基础。
