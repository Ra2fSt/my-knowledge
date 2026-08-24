---
title: TypeScript 基础笔记
description: 类型注解、接口与泛型的入门速记。
pubDate: 2026-08-15
updatedDate: 2026-08-15
category: 编程
tags: [TypeScript]
status: learning
---

TypeScript 为 JavaScript 增加了静态类型，让错误在编译期暴露。

## 基本类型注解

```ts
const title: string = '我的知识花园';
const count: number = 42;
const tags: string[] = ['Astro', '双链'];
```

## 接口

```ts
interface Note {
  title: string;
  pubDate: Date;
  tags?: string[]; // 可选字段
}
```

## 泛型

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

（持续补充中……）
